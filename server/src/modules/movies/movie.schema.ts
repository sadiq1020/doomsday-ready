import { z } from "zod";

// Base validation schema for a single movie creation payload
export const createMovieSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  releaseYear: z.number().int("Release year must be an integer"),
  runtime: z
    .number()
    .int("Runtime must be an integer")
    .min(1, "Runtime must be at least 1 minute")
    .max(300, "Runtime cannot exceed 300 minutes"),
  prerequisiteIds: z.array(z.string().min(1)).optional().default([]),
  watched: z.boolean().optional().default(false),
});

// Accepts either one movie or an array of movies for POST /api/movies
export const postMoviesSchema = z.union([
  createMovieSchema,
  z.array(createMovieSchema).min(1, "Must provide at least one movie"),
]);

// Validation schema for partial updates via PATCH /api/movies/:id
export const updateMovieSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    releaseYear: z.number().int("Release year must be an integer").optional(),
    runtime: z
      .number()
      .int("Runtime must be an integer")
      .min(1, "Runtime must be at least 1 minute")
      .max(300, "Runtime cannot exceed 300 minutes")
      .optional(),
    watched: z.boolean().optional(),
    prerequisiteIds: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update"
  );

// Route parameter validation
export const movieIdParamSchema = z.object({
  id: z.string().min(1, "Movie ID is required"),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
