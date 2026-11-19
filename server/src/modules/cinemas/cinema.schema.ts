import { z } from "zod";

// Schema for a single cinema creation
export const createCinemaSchema = z.object({
  name: z.string().trim().min(1, "Cinema name cannot be empty"),
  bundleSizes: z
    .array(
      z
        .number()
        .int("Each bundle size must be an integer")
        .min(1, "Bundle sizes must be at least 1")
        .max(500, "Bundle sizes cannot exceed 500")
    )
    .min(1, "At least one bundle size is required")
    .max(10, "Cannot have more than 10 bundle sizes")
    .refine(
      (sizes) => new Set(sizes).size === sizes.length,
      "Bundle sizes must all be different"
    ),
});

// Accept one cinema or an array for POST /api/cinemas
export const postCinemasSchema = z.union([
  createCinemaSchema,
  z.array(createCinemaSchema).min(1, "Must provide at least one cinema"),
]);

// Route param validation
export const cinemaIdParamSchema = z.object({
  id: z.string().min(1, "Cinema ID is required"),
});

// Query param validation for the booking endpoint
export const bookingQuerySchema = z.object({
  groupSize: z.coerce
    .number()
    .int("groupSize must be an integer")
    .min(1, "groupSize must be at least 1")
    .max(10000, "groupSize cannot exceed 10000"),
});

export type CreateCinemaInput = z.infer<typeof createCinemaSchema>;

