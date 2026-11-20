"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMovies,
  createMovie,
  updateMovie,
  getRewatchOrder,
} from "../lib/api";
import type {
  Movie,
  CreateMoviePayload,
  UpdateMoviePayload,
  RewatchOrder,
} from "../types/api";
import { movieKeys } from "./query-keys";

/**
 * Hook to retrieve all cataloged movies ordered by releaseYear, then title.
 */
export function useMovies() {
  return useQuery<Movie[], Error>({
    queryKey: movieKeys.list(),
    queryFn: getMovies,
  });
}

/**
 * Hook to create a single movie or batch of movies.
 */
export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMoviePayload | CreateMoviePayload[]) =>
      createMovie(data),
    onSuccess: () => {
      // Invalidate the movie list so new additions are immediately fetched
      queryClient.invalidateQueries({ queryKey: movieKeys.list() });
    },
  });
}

/**
 * Hook to update a movie.
 *
 * Optimistic Update Implementation:
 * 1. onMutate: Cancels ongoing queries for the movie list to prevent race conditions,
 *    snapshots the current cache for rollback, and immediately applies the new attributes
 *    (e.g., watched toggle) to the cache so the UI reacts with zero latency.
 * 2. onError: If the server rejects the update (e.g. 409 cycle, network failure),
 *    the cache is restored to the previous snapshot.
 * 3. onSettled: Regardless of outcome, invalidates both the movies list and all
 *    rewatch-order queries to maintain complete consistency with backend state.
 */
export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation<
    Movie,
    Error,
    { id: string; payload: UpdateMoviePayload },
    { previousMovies?: Movie[] }
  >({
    mutationFn: ({ id, payload }) => updateMovie(id, payload),

    onMutate: async ({ id, payload }) => {
      // Step A: Cancel any outgoing refetches so they don't overwrite optimistic data
      await queryClient.cancelQueries({ queryKey: movieKeys.list() });

      // Step B: Snapshot the current movies list state for rollback on error
      const previousMovies = queryClient.getQueryData<Movie[]>(movieKeys.list());

      // Step C: Optimistically apply the changes directly to the cache
      if (previousMovies) {
        queryClient.setQueryData<Movie[]>(
          movieKeys.list(),
          previousMovies.map((movie) =>
            movie.id === id ? { ...movie, ...payload } : movie
          )
        );
      }

      // Return context containing the snapshot
      return { previousMovies };
    },

    onError: (_err, _variables, context) => {
      // Step D: Roll back cache to the exact state before mutation if the request fails
      if (context?.previousMovies) {
        queryClient.setQueryData<Movie[]>(
          movieKeys.list(),
          context.previousMovies
        );
      }
    },

    onSettled: () => {
      // Step E: Invalidate movie list and all rewatch orders to synchronize with server truth
      queryClient.invalidateQueries({ queryKey: movieKeys.list() });
      queryClient.invalidateQueries({ queryKey: movieKeys.allRewatchOrders() });
    },
  });
}

/**
 * Hook to compute the topological rewatch sequence for a chosen target movie.
 */
export function useRewatchOrder(movieId: string | null | undefined) {
  const isEnabled = Boolean(movieId && movieId.trim().length > 0);

  return useQuery<RewatchOrder, Error>({
    queryKey: movieKeys.rewatchOrder(movieId || ""),
    queryFn: () => getRewatchOrder(movieId!),
    enabled: isEnabled,
  });
}

