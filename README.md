# Doomsday Ready

## 1. Overview

Doomsday Ready is a full-stack application built to help Marvel Cinematic Universe (MCU) fans prepare for the release of Avengers: Doomsday. It provides a rewatch planner that computes the exact prerequisite order of films required before watching a selected movie. In addition, it includes a watch-party booking calculator that determines the minimum number of seat bundles required to accommodate a group without empty seats. All graph traversal and seat allocation algorithms are implemented from scratch without external libraries.

## 2. Tech Stack

- Server: Node.js (v20+), Express (v5), TypeScript, Prisma 7, PostgreSQL, Zod
- Containerization: Docker, Docker Compose
- Client: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion (`motion/react`), TanStack React Query, Lucide Icons (classified "Doom Dossier" design system)

## 3. Project Structure

```
doomsday-ready/
├── client/                 # Frontend Next.js 16 App Router application
│   ├── src/
│   │   ├── app/            # App Router pages (/, /movies, /plan, /booking)
│   │   ├── components/     # UI kit & chapter components (movies, plan, booking)
│   │   ├── hooks/          # TanStack Query custom hooks (useMovies, useCinemas, etc.)
│   │   ├── lib/            # Typed API client, error handler, formatters
│   │   └── types/          # Shared frontend API type contracts
│   ├── DESIGN.md           # "The Doom Dossier" aesthetic design specification
│   ├── Dockerfile          # Multi-stage standalone production Next.js build
│   └── package.json        # Client dependencies and build scripts
├── server/                 # Backend Express API and Prisma database layer
│   ├── prisma/             # Prisma schema, migrations, and seed script
│   │   ├── migrations/     # Database migration history
│   │   ├── schema.prisma   # PostgreSQL data model definitions
│   │   └── seed.ts         # Idempotent database seed script
│   ├── src/
│   │   ├── config/         # Environment variable schemas and Prisma client singleton
│   │   ├── lib/            # Reusable database and driver adapter instances
│   │   ├── middleware/     # Error handler, 404 handler, and validation middleware
│   │   ├── modules/        # Feature modules (health, movies, cinemas)
│   │   │   ├── cinemas/    # Cinema CRUD, booking algorithm, controller, routes
│   │   │   ├── health/     # System health check module
│   │   │   └── movies/     # Movie CRUD, graph cycle/order logic, controller, routes
│   │   ├── utils/          # AppError class and async request handler wrapper
│   │   ├── app.ts          # Express application configuration and middleware stack
│   │   └── server.ts       # Server entrypoint and graceful shutdown listeners
│   ├── Dockerfile          # Multi-stage production container build
│   ├── package.json        # Server dependencies and lifecycle scripts
│   ├── prisma.config.ts    # Prisma 7 configuration file
│   └── tsconfig.json       # TypeScript compiler configuration
├── docker-compose.yml      # Orchestration for PostgreSQL, server, and client
├── .env.example            # Environment variable template
├── .gitignore              # Repository file exclusion patterns
└── README.md               # Project documentation
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

#### 1. Backend Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the local `.env` file (refer to `.env.example`).
4. Apply Prisma migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npx tsx prisma/seed.ts
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

#### 2. Frontend Client
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `client/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

3. Configure environment variables:
   Create a `.env` file inside `server/` with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@localhost:5432/doomsday_ready?schema=public
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The local development server runs with hot reload via `tsx` on `http://localhost:5000`.

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

#### 1. Create Movie (`POST /api/movies`)

Accepts a single movie object or an array of movies.

**Request:**
```json
{
  "title": "Iron Man",
  "releaseYear": 2008,
  "runtime": 126,
  "watched": true,
  "prerequisiteIds": []
}
```

**Response (`201 Created`):**
```json
{
  "id": "b1b518c0-8260-4965-b1a9-3d1222956cf5",
  "title": "Iron Man",
  "releaseYear": 2008,
  "runtime": 126,
  "watched": true,
  "prerequisites": []
}
```

#### 2. Update Movie (`PATCH /api/movies/:id`)

Replaces the full prerequisite list and updates attributes.

**Request:**
```json
{
  "prerequisiteIds": [
    "b1b518c0-8260-4965-b1a9-3d1222956cf5"
  ]
}
```

**Response (`200 OK`):**
```json
{
  "id": "e0b5f1a2-3b4c-4d5e-8f6a-7b8c9d0e1f2a",
  "title": "Iron Man 2",
  "releaseYear": 2010,
  "runtime": 124,
  "watched": false,
  "prerequisites": [
    {
      "id": "b1b518c0-8260-4965-b1a9-3d1222956cf5",
      "title": "Iron Man"
    }
  ]
}
```

#### 3. Rewatch Order (`GET /api/movies/:id/rewatch-order`)

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

#### 4. Create Cinema (`POST /api/cinemas`)

Accepts a single cinema or an array of cinemas. Bundle sizes are automatically sorted ascending.

**Request:**
```json
{
  "name": "Starlight Cineplex",
  "bundleSizes": [4, 1, 3]
}
```

**Response (`201 Created`):**
```json
{
  "id": "a9c8b7a6-5d4e-3f2a-1b0c-9d8e7f6a5b4c",
  "name": "Starlight Cineplex",
  "bundleSizes": [1, 3, 4]
}
```

#### 5. Booking Quote — Possible (`GET /api/cinemas/:id/booking?groupSize=6`)

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

#### 6. Booking Quote — Not Possible (`GET /api/cinemas/:id/booking?groupSize=7`)

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

#### 7. Error Format with 409 Circular Dependency

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
- Data Scope: The prerequisite table in the seed script represents the sample dataset defined in the challenge assessment.

## 7. How the Algorithms Work

All core algorithms were written by hand in pure TypeScript without third-party graph or solver libraries.

### 1. Cycle Detection (`wouldCreateCycle`)
- Purpose: Prevent directed circular dependency chains when adding prerequisites to a movie.
- Mechanism:
  1. Rejects immediate self-references where `newPrerequisiteIds` contains `movieId`.
  2. Executes an iterative Depth-First Search (DFS) starting from every ID in `newPrerequisiteIds`.
  3. Uses a `visited` Set to avoid revisiting nodes and prevent infinite loops.
  4. If traversal reaches `movieId`, a path exists from the new prerequisites back to the target movie, proving that adding the relationship would create a cycle.
- Time Complexity: `O(V + E)` where `V` is the number of movies and `E` is the number of prerequisite links.
- Space Complexity: `O(V)` for the DFS stack and visited set.

### 2. Rewatch Order (`getRewatchOrder`)
- Purpose: Return all direct and indirect prerequisites for a target movie such that every movie appears strictly after its own prerequisites, excluding the target.
- Mechanism:
  1. Traverses the prerequisite graph using recursive DFS post-order traversal starting from `targetId`.
  2. Tracks processed nodes in a `visited` Set to prevent duplicate evaluations.
  3. Only after all prerequisites of a movie node are visited and appended to the output list does the movie append itself.
  4. Omits the initial `targetId` from the resulting list.
- Time Complexity: `O(V + E)` where `V` is the number of movies and `E` is the number of prerequisite edges.
- Space Complexity: `O(V)` for recursion depth and visited tracking.

### 3. Minimum Bundle Booking (`findMinBundles`)
- Purpose: Find the minimum number of seat bundles that sum to exactly `groupSize`.
- Mechanism:
  1. Implements bottom-up Dynamic Programming (unbounded minimum coin change).
  2. `dp[n]` represents the minimum number of bundles to reach exactly `n` seats, initialized to `Infinity`, with `dp[0] = 0`.
  3. `choice[n]` records which bundle size achieved the minimum count at `n`.
  4. Loops through each seat count from `1` to `groupSize` against all available bundle sizes. If `dp[n - size] + 1 < dp[n]`, it updates `dp[n]` and sets `choice[n] = size`.
  5. If `dp[groupSize]` remains `Infinity`, no exact combination exists and the function returns `null`.
  6. Reconstructs the combination by backtracking through `choice` from `groupSize` down to `0`, groups identical sizes, and sorts the breakdown descending (largest bundle first).
- Time Complexity: `O(groupSize * B)` where `B` is the count of bundle sizes (maximum 10). For `groupSize = 10,000` and `10` bundles, this requires at most `100,000` basic operations, executing in under 2 milliseconds.
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


