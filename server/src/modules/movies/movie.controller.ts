import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as movieService from "./movie.service.js";

// POST /api/movies - Create one movie or array of movies
export const createMoviesHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await movieService.createMovies(req.body);
    res.status(201).json(result);
  }
);

// GET /api/movies - List all movies ordered by releaseYear, then title
export const getAllMoviesHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await movieService.getAllMovies();
    res.status(200).json(result);
  }
);

// PATCH /api/movies/:id - Partial update of a movie
export const updateMovieHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const movieId = String(req.params.id);
    const result = await movieService.updateMovie(movieId, req.body);
    res.status(200).json(result);
  }
);

// GET /api/movies/:id/rewatch-order - Get topological rewatch order for a movie
export const getRewatchOrderHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const movieId = String(req.params.id);
    const result = await movieService.getMovieRewatchOrder(movieId);
    res.status(200).json(result);
  }
);
