"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCinemas, createCinema, getBookingQuote } from "../lib/api";
import type {
  Cinema,
  CreateCinemaPayload,
  BookingQuote,
} from "../types/api";
import { cinemaKeys } from "./query-keys";

/**
 * Hook to retrieve all registered cinemas ordered alphabetically by name.
 */
export function useCinemas() {
  return useQuery<Cinema[], Error>({
    queryKey: cinemaKeys.list(),
    queryFn: getCinemas,
  });
}

/**
 * Hook to create a single cinema or a batch of cinemas.
 */
export function useCreateCinema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCinemaPayload | CreateCinemaPayload[]) =>
      createCinema(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cinemaKeys.list() });
    },
  });
}

/**
 * Hook to calculate the minimum bundle seat breakdown for a group size.
 *
 * Enabled only when both arguments are valid:
 * - cinemaId is non-empty
 * - groupSize is an integer between 1 and 10,000
 */
export function useBookingQuote(
  cinemaId: string | null | undefined,
  groupSize: number | null | undefined
) {
  const isValidCinema = Boolean(cinemaId && cinemaId.trim().length > 0);
  const isValidGroup =
    typeof groupSize === "number" &&
    !isNaN(groupSize) &&
    Number.isInteger(groupSize) &&
    groupSize >= 1 &&
    groupSize <= 10000;

  return useQuery<BookingQuote, Error>({
    queryKey: cinemaKeys.booking(cinemaId || "", groupSize || 0),
    queryFn: () => getBookingQuote(cinemaId!, groupSize!),
    enabled: isValidCinema && isValidGroup,
  });
}

