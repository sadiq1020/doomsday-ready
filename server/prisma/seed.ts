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
  console.log("🌱 Seeding database...\n");

  // ── Pass 1: Upsert all movies WITHOUT prerequisites ──────────────────────
  // This ensures every movie exists before we try to link prerequisites.
  // Safe to run many times: upsert matches on the unique `title` field.
  console.log("📽️  Upserting movies (pass 1 — data only)...");
  for (const movie of MOVIES) {
    await prisma.movie.upsert({
      where:  { title: movie.title },
      create: { title: movie.title, releaseYear: movie.releaseYear, runtime: movie.runtime },
      update: { releaseYear: movie.releaseYear, runtime: movie.runtime },
    });
    console.log(`  ✓ ${movie.title}`);
  }

  // ── Pass 2: Set prerequisites now that all movies exist ──────────────────
  // Using `prerequisites: { set: [...] }` replaces the full list every run,
  // making this fully idempotent.
  console.log("\n🔗 Setting prerequisites (pass 2)...");
  for (const movie of MOVIES) {
    if (movie.prereqs.length === 0) continue;

    // Look up each prerequisite movie by its unique title to get its id
    const prereqMovies = await prisma.movie.findMany({
      where: { title: { in: movie.prereqs } },
      select: { id: true, title: true },
    });

    await prisma.movie.update({
      where: { title: movie.title },
      data: {
        prerequisites: {
          set: prereqMovies.map((m) => ({ id: m.id })),
        },
      },
    });
    console.log(`  ✓ ${movie.title} → [${movie.prereqs.join(", ")}]`);
  }

  // ── Seed cinemas ─────────────────────────────────────────────────────────
  // Upsert by unique `name`. bundleSizes stored sorted ascending.
  console.log("\n🎬 Upserting cinemas...");
  for (const cinema of CINEMAS) {
    const sorted = [...cinema.bundleSizes].sort((a, b) => a - b);
    await prisma.cinema.upsert({
      where:  { name: cinema.name },
      create: { name: cinema.name, bundleSizes: sorted },
      update: { bundleSizes: sorted },
    });
    console.log(`  ✓ ${cinema.name} — bundles: [${sorted.join(", ")}]`);
  }

  console.log("\n✅ Seed complete!");
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

