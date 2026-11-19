import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { findMinBundles } from "./booking.algorithm.js";
import type { CreateCinemaInput } from "./cinema.schema.js";

// Standard cinema select shape
const cinemaSelect = {
  id: true,
  name: true,
  bundleSizes: true,
} as const;

// Transaction options for Neon cloud latency
const TX_OPTIONS = {
  maxWait: 10000,
  timeout: 20000,
} as const;

/**
 * Creates one cinema or a batch of cinemas.
 * bundleSizes are stored sorted ascending.
 */
export async function createCinemas(
  input: CreateCinemaInput | CreateCinemaInput[]
) {
  const items = Array.isArray(input) ? input : [input];
  const isBatch = Array.isArray(input);

  // Check for duplicate names within the payload itself (case-insensitive)
  const seenNames = new Set<string>();
  for (const item of items) {
    const lower = item.name.toLowerCase();
    if (seenNames.has(lower)) {
      throw new AppError(
        409,
        "DUPLICATE_NAME",
        `Duplicate cinema name "${item.name}" found in payload`
      );
    }
    seenNames.add(lower);
  }

  if (isBatch) {
    return await prisma.$transaction(async (tx) => {
      const created = [];
      for (const item of items) {
        // Case-insensitive uniqueness check against DB
        const existing = await tx.cinema.findFirst({
          where: { name: { equals: item.name, mode: "insensitive" } },
        });
        if (existing) {
          throw new AppError(
            409,
            "DUPLICATE_NAME",
            `A cinema with name "${item.name}" already exists`
          );
        }

        const cinema = await tx.cinema.create({
          data: {
            name: item.name,
            bundleSizes: [...item.bundleSizes].sort((a, b) => a - b),
          },
          select: cinemaSelect,
        });
        created.push(cinema);
      }
      return created;
    }, TX_OPTIONS);
  }

  // Single creation
  const item = items[0];
  const existing = await prisma.cinema.findFirst({
    where: { name: { equals: item.name, mode: "insensitive" } },
  });
  if (existing) {
    throw new AppError(
      409,
      "DUPLICATE_NAME",
      `A cinema with name "${item.name}" already exists`
    );
  }

  return await prisma.cinema.create({
    data: {
      name: item.name,
      bundleSizes: [...item.bundleSizes].sort((a, b) => a - b),
    },
    select: cinemaSelect,
  });
}

/**
 * Lists all cinemas ordered by name ascending.
 */
export async function getAllCinemas() {
  return await prisma.cinema.findMany({
    orderBy: { name: "asc" },
    select: cinemaSelect,
  });
}

/**
 * Calculates the minimum bundle breakdown for a given group size.
 */
export async function getBooking(cinemaId: string, groupSize: number) {
  const cinema = await prisma.cinema.findUnique({
    where: { id: cinemaId },
    select: cinemaSelect,
  });

  if (!cinema) {
    throw new AppError(404, "NOT_FOUND", `Cinema with ID "${cinemaId}" not found`);
  }

  const breakdown = findMinBundles(cinema.bundleSizes, groupSize);

  if (breakdown === null) {
    return {
      cinema,
      groupSize,
      possible: false,
      totalBundles: 0,
      breakdown: [],
      message: "No exact combination of bundles matches this group size.",
    };
  }

  const totalBundles = breakdown.reduce((sum, b) => sum + b.count, 0);

  return {
    cinema,
    groupSize,
    possible: true,
    totalBundles,
    breakdown,
    message: `${totalBundles} bundle(s) cover all ${groupSize} seats exactly.`,
  };
}

