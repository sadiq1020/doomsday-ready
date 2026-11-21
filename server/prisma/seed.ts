import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Use a direct connection for seeding (not pooled)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 10000,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

// ─── Movie definitions ────────────────────────────────────────────────────────
// Prerequisites are stored as title references, resolved below after all movies
// are upserted (two-pass strategy ensures referential integrity every run).

const MOVIES = [
  { title: "Iron Man",                              releaseYear: 2008, runtime: 126, prereqs: [] },
  { title: "Captain America: The First Avenger",   releaseYear: 2011, runtime: 124, prereqs: [] },
  { title: "The Avengers",                         releaseYear: 2012, runtime: 143, prereqs: ["Iron Man", "Captain America: The First Avenger"] },
  { title: "Captain America: Civil War",           releaseYear: 2016, runtime: 147, prereqs: ["The Avengers"] },
  { title: "Thor: Ragnarok",                       releaseYear: 2017, runtime: 130, prereqs: [] },
  { title: "Avengers: Infinity War",               releaseYear: 2018, runtime: 149, prereqs: ["Captain America: Civil War", "Thor: Ragnarok"] },
  { title: "Avengers: Endgame",                    releaseYear: 2019, runtime: 181, prereqs: ["Avengers: Infinity War"] },
  { title: "Avengers: Doomsday",                   releaseYear: 2026, runtime: 150, prereqs: ["Avengers: Endgame"] },
];

// ─── Cinema definitions ───────────────────────────────────────────────────────
const CINEMAS = [
  { name: "Starlight Cineplex",  bundleSizes: [1, 3, 4] },
  { name: "Galaxy Hall",         bundleSizes: [2, 5] },
  { name: "Vibranium Screens",   bundleSizes: [6, 9, 20] },
];

// ─── Seed function ────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Checking database seed state...\n");

  // Track movies created during this run so we only link prerequisites for newly created records.
  // Existing movies are never modified, preserving user-edited watched states, runtimes, and prerequisites.
  const newlyCreatedTitles = new Set<string>();

  // ── Pass 1: Create MISSING movies only (never overwrite existing) ──────────
  console.log("📽️  Verifying movies (creating missing only)...");
  for (const movie of MOVIES) {
    const existing = await prisma.movie.findFirst({
      where: { title: { equals: movie.title, mode: "insensitive" } },
      select: { id: true, title: true, watched: true },
    });

    if (!existing) {
      await prisma.movie.create({
        data: {
          title: movie.title,
          releaseYear: movie.releaseYear,
          runtime: movie.runtime,
          watched: false,
        },
      });
      newlyCreatedTitles.add(movie.title.toLowerCase());
      console.log(`  + Created missing movie: "${movie.title}"`);
    } else {
      console.log(`  = Preserved existing movie: "${existing.title}" (watched: ${existing.watched})`);
    }
  }

  // ── Pass 2: Link prerequisites ONLY for newly created movies ─────────────
  if (newlyCreatedTitles.size > 0) {
    console.log("\n🔗 Linking prerequisites for newly created movies...");
    for (const movie of MOVIES) {
      if (!newlyCreatedTitles.has(movie.title.toLowerCase())) {
        continue;
      }
      if (movie.prereqs.length === 0) continue;

      const prereqMovies = await prisma.movie.findMany({
        where: { title: { in: movie.prereqs } },
        select: { id: true, title: true },
      });

      if (prereqMovies.length > 0) {
        await prisma.movie.update({
          where: { title: movie.title },
          data: {
            prerequisites: {
              connect: prereqMovies.map((m) => ({ id: m.id })),
            },
          },
        });
        console.log(`  ✓ Linked ${movie.title} → [${movie.prereqs.join(", ")}]`);
      }
    }
  } else {
    console.log("\n🔗 No newly created movies — prerequisite relationships preserved as-is.");
  }

  // ── Pass 3: Create MISSING cinemas only (never overwrite existing) ────────
  console.log("\n🎬 Verifying cinemas (creating missing only)...");
  for (const cinema of CINEMAS) {
    const existing = await prisma.cinema.findFirst({
      where: { name: { equals: cinema.name, mode: "insensitive" } },
      select: { id: true, name: true, bundleSizes: true },
    });

    if (!existing) {
      const sorted = [...cinema.bundleSizes].sort((a, b) => a - b);
      await prisma.cinema.create({
        data: { name: cinema.name, bundleSizes: sorted },
      });
      console.log(`  + Created missing cinema: "${cinema.name}" [${sorted.join(", ")}]`);
    } else {
      console.log(`  = Preserved existing cinema: "${existing.name}" [${existing.bundleSizes.join(", ")}]`);
    }
  }

  console.log("\n✅ Seed safety check complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

