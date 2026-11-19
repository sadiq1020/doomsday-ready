import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import {
  postMoviesSchema,
  updateMovieSchema,
  movieIdParamSchema,
} from "./movie.schema.js";
import {
  createMoviesHandler,
  getAllMoviesHandler,
  updateMovieHandler,
  getRewatchOrderHandler,
} from "./movie.controller.js";

const router = Router();

// POST /api/movies - Create one movie or array of movies
router.post("/", validate(postMoviesSchema), createMoviesHandler);

// GET /api/movies - List all movies ordered by releaseYear, then title
router.get("/", getAllMoviesHandler);

// PATCH /api/movies/:id - Partial update of a movie
router.patch(
  "/:id",
  validate({ params: movieIdParamSchema, body: updateMovieSchema }),
  updateMovieHandler
);

// GET /api/movies/:id/rewatch-order - Get topological rewatch order for a movie
router.get(
  "/:id/rewatch-order",
  validate({ params: movieIdParamSchema }),
  getRewatchOrderHandler
);

export const movieRouter = router;

