import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./modules/health/health.route.js";
import { movieRouter } from "./modules/movies/movie.route.js";

const app = express();

// Secure HTTP response headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors());

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes mounted under /api
app.use("/api", healthRouter);
app.use("/api/movies", movieRouter);

// 404 handler for undefined routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export { app };
