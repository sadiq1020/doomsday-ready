# Doomsday Ready

## Live Demo

- App: https://doomsday-ready-smoky.vercel.app
- API health check: https://doomsday-ready-hbcb.onrender.com/api/health

The API runs on Render's free plan and sleeps after inactivity. The first request after a sleep period can take up to a minute. The database is PostgreSQL on Neon.

## 1. Overview

Doomsday Ready is a full-stack application built to help Marvel Cinematic Universe (MCU) fans prepare for the release of Avengers: Doomsday. It provides a rewatch planner that computes the exact prerequisite order of films required before watching a selected movie. In addition, it includes a watch-party booking calculator that determines the minimum number of seat bundles required to accommodate a group without empty seats. All graph traversal and seat allocation algorithms are implemented in plain TypeScript with no graph or solver libraries.

## 2. Tech Stack

- Server: Node.js (v20+), Express (v5), TypeScript, Prisma 7, PostgreSQL, Zod
- Containerization: Docker, Docker Compose
- Client: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion (`motion/react`), TanStack React Query, Lucide Icons (classified "Doom Dossier" design system)

## 3. Project Structure

```
doomsday-ready/
├── client/                 # Next.js 16 App Router frontend
│   ├── src/
│   │   ├── app/            # Pages: /, /movies, /plan, /booking
│   │   ├── components/     # UI components per chapter
│   │   ├── hooks/          # TanStack Query hooks
│   │   ├── lib/            # API client, formatters, error handler
│   │   └── types/          # Shared API type contracts
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express 5 API and Prisma database layer
│   ├── prisma/             # Schema, migrations, idempotent seed
│   ├── src/
│   │   ├── config/         # Env validation, Prisma client singleton
│   │   ├── middleware/     # Error handler, validation
│   │   └── modules/        # Feature modules: health, movies, cinemas
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 4. How to Run

### Running with Docker Compose

1. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```

2. Start all services (Database, Express Server, and Next.js Client):
   ```bash
   docker compose up --build
   ```

3. Access the application and endpoints:
   - Web Client: `http://localhost:3000`
   - Server Health check: `http://localhost:5000/api/health`
   - Movies API: `http://localhost:5000/api/movies`
   - Cinemas API: `http://localhost:5000/api/cinemas`

On startup, Docker Compose starts the PostgreSQL container, waits for the health check to pass, runs `prisma migrate deploy`, executes the idempotent seed script, launches the Express API server on port 5000, and serves the optimized standalone Next.js frontend on port 3000.

### Running Locally

#### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/doomsday_ready
CLIENT_ORIGIN=http://localhost:3000
```

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

The server starts on `http://localhost:5000`.

#### Frontend

```bash
cd client
npm install
```

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open `http://localhost:3000`.

### Environment Variables

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `PORT` | Server | HTTP port (default 5000) |
| `NODE_ENV` | Server | `development` or `production` |
| `CLIENT_ORIGIN` | Server | Comma-separated allowed CORS origins |
| `POSTGRES_USER` | Docker | PostgreSQL superuser name |
| `POSTGRES_PASSWORD` | Docker | PostgreSQL superuser password |
| `POSTGRES_DB` | Docker | PostgreSQL database name |
| `NEXT_PUBLIC_API_URL` | Client | Base API URL — baked in at build time |

### Deployment

**Server — Render (Node runtime)**

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm run seed && npm start` |
| Health Check Path | `/api/health` |

Set `CLIENT_ORIGIN` on Render to the Vercel frontend URL (e.g. `https://doomsday-ready-smoky.vercel.app`). Set `DATABASE_URL` to the Neon connection string.

**Client — Vercel**

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Build Command | `npm run build` |
| `NEXT_PUBLIC_API_URL` | Render API URL ending in `/api` (e.g. `https://doomsday-ready-hbcb.onrender.com/api`) |

**Database — Neon**

Create a PostgreSQL database on Neon and copy the connection string into `DATABASE_URL` on Render.

## 5. API Reference

### Endpoints Summary

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service uptime and status check |
| `POST` | `/api/movies` | Create one movie or a batch of movies |
| `GET` | `/api/movies` | List all movies ordered by release year, then title |
| `PATCH` | `/api/movies/:id` | Partially update movie details or replace prerequisite list |
| `GET` | `/api/movies/:id/rewatch-order` | Retrieve topological rewatch list and remaining runtime |
| `POST` | `/api/cinemas` | Create one cinema or a batch of cinemas |
| `GET` | `/api/cinemas` | List all cinemas ordered by name |
| `GET` | `/api/cinemas/:id/booking?groupSize=N` | Calculate the minimum bundle combination for a group |

---

### Request and Response Examples

#### 1. Rewatch Order (`GET /api/movies/:id/rewatch-order`)

**Response (`200 OK`):**
```json
{
  "target": {
    "id": "f5c2d3e4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
    "title": "The Avengers"
  },
  "order": [
    {
      "id": "b1b518c0-8260-4965-b1a9-3d1222956cf5",
      "title": "Iron Man",
      "releaseYear": 2008,
      "runtime": 126,
      "watched": true
    },
    {
      "id": "c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
      "title": "Captain America: The First Avenger",
      "releaseYear": 2011,
      "runtime": 124,
      "watched": false
    }
  ],
  "summary": {
    "total": 2,
    "watched": 1,
    "unwatched": 1,
    "remainingRuntimeMinutes": 124
  }
}
```

#### 2. Booking Quote — Possible (`GET /api/cinemas/:id/booking?groupSize=6`)

**Response (`200 OK`):**
```json
{
  "cinema": {
    "id": "a9c8b7a6-5d4e-3f2a-1b0c-9d8e7f6a5b4c",
    "name": "Starlight Cineplex",
    "bundleSizes": [1, 3, 4]
  },
  "groupSize": 6,
  "possible": true,
  "totalBundles": 2,
  "breakdown": [
    {
      "size": 3,
      "count": 2
    }
  ],
  "message": "2 bundle(s) cover all 6 seats exactly."
}
```

#### 3. Booking Quote — Not Possible (`GET /api/cinemas/:id/booking?groupSize=7`)

Given bundle sizes `[4, 6]`.

**Response (`200 OK`):**
```json
{
  "cinema": {
    "id": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    "name": "Galaxy Hall",
    "bundleSizes": [4, 6]
  },
  "groupSize": 7,
  "possible": false,
  "totalBundles": 0,
  "breakdown": [],
  "message": "No exact combination of bundles matches this group size."
}
```

#### 4. Error Format — 409 Circular Dependency

All application errors follow a unified structure: `{ "error": { "code": string, "message": string, "details"?: array } }`.

**Response (`409 Conflict`):**
```json
{
  "error": {
    "code": "CIRCULAR_DEPENDENCY",
    "message": "Adding these prerequisites would create a circular dependency cycle"
  }
}
```

## 6. Assumptions and Decisions

- Batch Support: `POST /api/movies` and `POST /api/cinemas` accept either a single object or an array of objects. Batch operations run in a single transaction.
- Case-Insensitive Uniqueness: Titles and cinema names are validated case-insensitively using PostgreSQL `mode: "insensitive"`. Submitting a duplicate name returns `409 DUPLICATE_TITLE` or `409 DUPLICATE_NAME`.
- Bundle Size Rules: Bundle sizes must contain 1 to 10 distinct integers between 1 and 500. Duplicates within a submission return `400 VALIDATION_ERROR`. Stored arrays are always sorted in ascending order.
- Prerequisite Validation: Any prerequisite ID in a create or update payload that does not exist in the database triggers `400 INVALID_PREREQUISITE` before checking for cycles.
- Self-Dependencies: A movie cannot reference itself as a prerequisite. Attempting to do so immediately triggers `409 CIRCULAR_DEPENDENCY`.
- Transaction Safety: Movie updates via `PATCH` run all existence checks, title uniqueness validations, prerequisite lookups, and graph cycle verification inside a single `prisma.$transaction`.
- Seed Placeholder: The runtime for "Avengers: Doomsday" is set to 150 minutes as a placeholder since the movie has not yet been released.

### Known Limitations

- No automated tests: the project was time-boxed and behavior was verified manually against all examples in the assessment.
- No delete endpoints for movies or cinemas.
- The free hosting tier causes a slow first request after a period of inactivity.

## 7. How the Algorithms Work

All core algorithms are implemented in plain TypeScript with no graph or solver libraries.

### 1. Cycle Detection (`wouldCreateCycle`)
- Purpose: Prevent circular prerequisite chains when adding or updating a movie's prerequisites.
- Mechanism:
  1. Rejects immediate self-references.
  2. Runs an iterative DFS from every new prerequisite ID.
  3. If traversal reaches the target movie, the update would create a cycle and is rejected.
- Time Complexity: `O(V + E)` where `V` is the number of movies and `E` is the number of prerequisite links.
- Space Complexity: `O(V)` for the DFS stack and visited set.

### 2. Rewatch Order (`getRewatchOrder`)
- Purpose: Return all direct and indirect prerequisites for a target movie in an order where every film appears after its own prerequisites, excluding the target itself.
- Mechanism:
  1. Recursive DFS post-order traversal from the target movie.
  2. A `visited` Set prevents duplicate entries.
  3. Each node appends itself only after all its prerequisites have been appended.
- Time Complexity: `O(V + E)` where `V` is the number of movies and `E` is the number of prerequisite edges.
- Space Complexity: `O(V)` for recursion depth and visited tracking.

### 3. Minimum Bundle Booking (`findMinBundles`)
- Purpose: Find the minimum number of seat bundles that sum to exactly `groupSize`.
- Mechanism:
  1. Bottom-up dynamic programming (unbounded minimum coin change). `dp[n]` = minimum bundles to reach exactly `n` seats; `dp[0] = 0`, all others initialised to `Infinity`.
  2. For each seat count `1` to `groupSize`, iterates over all bundle sizes; if `dp[n - size] + 1 < dp[n]`, updates `dp[n]` and records the choice.
  3. If `dp[groupSize]` remains `Infinity`, no exact combination exists and the function returns `null`.
  4. Reconstructs the breakdown by backtracking through recorded choices, then groups and sorts descending.
- Time Complexity: `O(groupSize × B)` where `B` is the number of bundle sizes (at most 10).
- Space Complexity: `O(groupSize)` for the `dp` and `choice` arrays.

## 8. Data Model Diagram

```mermaid
erDiagram
    Movie {
        string id PK
        string title UK
        int releaseYear
        int runtime
        boolean watched
        datetime createdAt
        datetime updatedAt
    }

    Cinema {
        string id PK
        string name UK
        int[] bundleSizes
        datetime createdAt
        datetime updatedAt
    }

    Movie }o--o{ Movie : "prerequisites / dependents"
```

## 9. How I used AI

AI assistance was utilized as a planning and workflow accelerator throughout this project, with human direction guiding the architecture, design choices, and verification:

- Architectural Planning: I used Claude (claude.ai) during the initial phase to analyze the requirements and organize the project into a structured, phased implementation roadmap. This ensured a disciplined approach where backend core logic, graph algorithms, and database setup were planned out before moving into deployment and frontend tasks.
- Incremental Implementation: Within the Antigravity IDE, I directed the assistant to implement the planned modules step-by-step. I defined the architectural patterns (feature-based routing, controller-service separation, centralized error handling, and Prisma 7 adapter configuration), reviewing and refining the code at each stage.
- Edge Case Verification: I used the assistant to help write and run targeted validation tests for algorithm edge cases, including self-referencing prerequisite loops, transitive circular dependencies, and unreachable seat bundle combinations.


