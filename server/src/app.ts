import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./modules/health/health.route.js";
import { movieRouter } from "./modules/movies/movie.route.js";
import { cinemaRouter } from "./modules/cinemas/cinema.route.js";

const app = express();

// Secure HTTP response headers
app.use(helmet());

// Cross-Origin Resource Sharing with CLIENT_ORIGIN whitelist
const allowedOrigins = env.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header (e.g. server-to-server, curl, Postman, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS blocked: origin ${origin} is not allowed by CLIENT_ORIGIN policy`)
      );
    },
    credentials: true,
  })
);

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes mounted under /api
app.use("/api", healthRouter);
app.use("/api/movies", movieRouter);
app.use("/api/cinemas", cinemaRouter);

// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export { app };
