# ─── Stage 1: Builder ────────────────────────────────────────────────────────
# Install all deps, generate Prisma client, compile TypeScript
FROM node:20-alpine AS builder

# openssl is required by Prisma's query engine on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Install all dependencies (dev included — needed for prisma CLI and tsc)
COPY package*.json ./
RUN npm ci

# Copy Prisma config + schema before generating client
COPY prisma.config.ts tsconfig.json ./
COPY prisma/ ./prisma/

# Generate Prisma client into node_modules
RUN npx prisma generate

# Copy source and compile TypeScript → dist/
COPY src/ ./src/
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
# Lean runtime image — only what is needed to run the server
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

# Bring node_modules from builder (includes prisma CLI, tsx, and all prod deps)
COPY --from=builder /app/node_modules ./node_modules

# Compiled application
COPY --from=builder /app/dist ./dist

# Prisma schema + migrations (needed for migrate deploy)
# prisma.config.ts (Prisma 7 reads DATABASE_URL from container environment)
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY prisma.config.ts ./

ENV NODE_ENV=production
EXPOSE 5000

# Startup sequence:
#   1. prisma migrate deploy  — apply any pending migrations
#   2. npm run seed           — upsert seed data (idempotent, safe every restart)
#   3. node dist/server.js    — start the Express API
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/server.js"]

