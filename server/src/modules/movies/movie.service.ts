import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { wouldCreateCycle, getRewatchOrder } from "./movie.graph.js";
import type { CreateMovieInput, UpdateMovieInput } from "./movie.schema.js";

// Standard movie select shape required across all endpoints
const movieSelect = {
  id: true,
  title: true,
  releaseYear: true,
  runtime: true,
  watched: true,
  prerequisites: {
    select: {
      id: true,
      title: true,
    },
  },
} as const;

// Default transaction options to handle cloud database network latency (e.g. Neon)
const TX_OPTIONS = {
  maxWait: 10000, // 10 seconds to acquire connection
  timeout: 20000, // 20 seconds for transaction execution
} as const;

/**
 * Creates one movie or a batch of movies.
 */
export async function createMovies(input: CreateMovieInput | CreateMovieInput[]) {
  // Case A: Batch creation of movies
  if (Array.isArray(input)) {
    return await prisma.$transaction(async (tx) => {
      // 1. Check for duplicate titles within payload itself (case-insensitive)
      const seenTitles = new Set<string>();
      for (const item of input) {
        const lower = item.title.toLowerCase();
        if (seenTitles.has(lower)) {
          throw new AppError(
            409,
            "DUPLICATE_TITLE",
            `Duplicate movie title "${item.title}" found in payload`
          );
        }
        seenTitles.add(lower);
      }

      // 2. Check for duplicate titles against existing database records
      for (const item of input) {
        const existing = await tx.movie.findFirst({
          where: { title: { equals: item.title, mode: "insensitive" } },
        });
        if (existing) {
          throw new AppError(
            409,
            "DUPLICATE_TITLE",
            `A movie with title "${item.title}" already exists`
          );
        }
      }

      // 3. Process and create each movie
      const createdMovies = [];
      for (const item of input) {
        const uniquePrereqs = [...new Set(item.prerequisiteIds || [])];

        // Validate that all prerequisites exist
        if (uniquePrereqs.length > 0) {
          const found = await tx.movie.findMany({
            where: { id: { in: uniquePrereqs } },
            select: { id: true },
          });
          if (found.length !== uniquePrereqs.length) {
            const foundIds = new Set(found.map((m) => m.id));
            const missing = uniquePrereqs.filter((id) => !foundIds.has(id));
            throw new AppError(
              400,
              "INVALID_PREREQUISITE",
              `Prerequisite movie ID(s) not found: ${missing.join(", ")}`
            );
          }
        }

        const created = await tx.movie.create({
          data: {
            title: item.title,
            releaseYear: item.releaseYear,
            runtime: item.runtime,
            watched: item.watched ?? false,
            prerequisites: {
              connect: uniquePrereqs.map((id) => ({ id })),
            },
          },
          select: movieSelect,
        });

        createdMovies.push(created);
      }

      return createdMovies;
    }, TX_OPTIONS);
  }

  // Case B: Single movie creation
  const uniquePrereqs = [...new Set(input.prerequisiteIds || [])];

  // 1. Check case-insensitive title uniqueness
  const existing = await prisma.movie.findFirst({
    where: { title: { equals: input.title, mode: "insensitive" } },
  });
  if (existing) {
    throw new AppError(
      409,
      "DUPLICATE_TITLE",
      `A movie with title "${input.title}" already exists`
    );
  }

  // 2. Validate prerequisites existence
  if (uniquePrereqs.length > 0) {
    const found = await prisma.movie.findMany({
      where: { id: { in: uniquePrereqs } },
      select: { id: true },
    });
    if (found.length !== uniquePrereqs.length) {
      const foundIds = new Set(found.map((m) => m.id));
      const missing = uniquePrereqs.filter((id) => !foundIds.has(id));
      throw new AppError(
        400,
        "INVALID_PREREQUISITE",
        `Prerequisite movie ID(s) not found: ${missing.join(", ")}`
      );
    }
  }

  // 3. Create movie in database
  const movie = await prisma.movie.create({
    data: {
      title: input.title,
      releaseYear: input.releaseYear,
      runtime: input.runtime,
      watched: input.watched ?? false,
      prerequisites: {
        connect: uniquePrereqs.map((id) => ({ id })),
      },
    },
    select: movieSelect,
  });

  return movie;
}

/**
 * Lists all movies ordered by releaseYear ascending, then title ascending.
 */
export async function getAllMovies() {
  return await prisma.movie.findMany({
    orderBy: [{ releaseYear: "asc" }, { title: "asc" }],
    select: movieSelect,
  });
}

/**
 * Partially updates an existing movie inside a transaction.
 */
export async function updateMovie(id: string, input: UpdateMovieInput) {
  // 1. Verify movie exists
  const existing = await prisma.movie.findUnique({
    where: { id },
    select: { id: true, title: true },
  });
  if (!existing) {
    throw new AppError(404, "NOT_FOUND", `Movie with ID "${id}" not found`);
  }

  // 2. Validate title uniqueness if changing title
  if (input.title !== undefined) {
    const duplicate = await prisma.movie.findFirst({
      where: {
        title: { equals: input.title, mode: "insensitive" },
        NOT: { id },
      },
    });
    if (duplicate) {
      throw new AppError(
        409,
        "DUPLICATE_TITLE",
        `A movie with title "${input.title}" already exists`
      );
    }
  }

  // 3. Validate prerequisites & circular dependencies if prerequisiteIds provided
  let prerequisiteUpdate: any = undefined;
  if (input.prerequisiteIds !== undefined) {
    const uniquePrereqs = [...new Set(input.prerequisiteIds)];

    // A movie cannot list itself as a prerequisite
    if (uniquePrereqs.includes(id)) {
      throw new AppError(
        409,
        "CIRCULAR_DEPENDENCY",
        "A movie cannot list itself as a prerequisite"
      );
    }

    // Check that all prerequisite IDs exist
    if (uniquePrereqs.length > 0) {
      const found = await prisma.movie.findMany({
        where: { id: { in: uniquePrereqs } },
        select: { id: true },
      });
      if (found.length !== uniquePrereqs.length) {
        const foundIds = new Set(found.map((m) => m.id));
        const missing = uniquePrereqs.filter((pid) => !foundIds.has(pid));
        throw new AppError(
          400,
          "INVALID_PREREQUISITE",
          `Prerequisite movie ID(s) not found: ${missing.join(", ")}`
        );
      }
    }

    // Load all movie -> prerequisite links in one query to check for cycles
    const allLinks = await prisma.movie.findMany({
      select: {
        id: true,
        prerequisites: { select: { id: true } },
      },
    });

    const edges = new Map<string, string[]>();
    for (const item of allLinks) {
      edges.set(
        item.id,
        item.prerequisites.map((p) => p.id)
      );
    }

    // Check if updating prerequisites creates any circular dependency
    if (wouldCreateCycle(id, uniquePrereqs, edges)) {
      throw new AppError(
        409,
        "CIRCULAR_DEPENDENCY",
        "Adding these prerequisites would create a circular dependency cycle"
      );
    }

    // Replace the full prerequisite list
    prerequisiteUpdate = {
      set: uniquePrereqs.map((pid) => ({ id: pid })),
    };
  }

  // 4. Update the movie record
  const updated = await prisma.movie.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.releaseYear !== undefined && { releaseYear: input.releaseYear }),
      ...(input.runtime !== undefined && { runtime: input.runtime }),
      ...(input.watched !== undefined && { watched: input.watched }),
      ...(prerequisiteUpdate !== undefined && {
        prerequisites: prerequisiteUpdate,
      }),
    },
    select: movieSelect,
  });

  return updated;
}

/**
 * Computes topological rewatch order for all direct and indirect prerequisites of a movie.
 */
export async function getMovieRewatchOrder(id: string) {
  // 1. Verify movie exists
  const target = await prisma.movie.findUnique({
    where: { id },
    select: { id: true, title: true },
  });
  if (!target) {
    throw new AppError(404, "NOT_FOUND", `Movie with ID "${id}" not found`);
  }

  // 2. Load all movie prerequisite links and details in one query
  const allMovies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      releaseYear: true,
      runtime: true,
      watched: true,
      prerequisites: {
        select: { id: true },
      },
    },
  });

  // 3. Build adjacency list and movie lookup map
  const edges = new Map<string, string[]>();
  const movieMap = new Map<string, (typeof allMovies)[number]>();

  for (const m of allMovies) {
    edges.set(
      m.id,
      m.prerequisites.map((p) => p.id)
    );
    movieMap.set(m.id, m);
  }

  // 4. Compute rewatch order using pure graph function
  const orderIds = getRewatchOrder(id, edges);

  const order = orderIds.map((orderId) => {
    const m = movieMap.get(orderId)!;
    return {
      id: m.id,
      title: m.title,
      releaseYear: m.releaseYear,
      runtime: m.runtime,
      watched: m.watched,
    };
  });

  // 5. Compute summary statistics
  const total = order.length;
  const watched = order.filter((m) => m.watched).length;
  const unwatched = total - watched;
  const remainingRuntimeMinutes = order
    .filter((m) => !m.watched)
    .reduce((sum, m) => sum + m.runtime, 0);

  return {
    target: {
      id: target.id,
      title: target.title,
    },
    order,
    summary: {
      total,
      watched,
      unwatched,
      remainingRuntimeMinutes,
    },
  };
}
