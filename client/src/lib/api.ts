import type {
  Movie,
  CreateMoviePayload,
  UpdateMoviePayload,
  RewatchOrder,
  Cinema,
  CreateCinemaPayload,
  BookingQuote,
  ApiErrorResponse,
} from "../types/api";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let code = "UNKNOWN_ERROR";
    let message = `Request failed with status ${response.status}`;
    let details: Array<{ field: string; message: string }> | undefined;

    try {
      const errorBody: ApiErrorResponse = await response.json();
      if (errorBody?.error) {
        code = errorBody.error.code || code;
        message = errorBody.error.message || message;
        details = errorBody.error.details;
      }
    } catch {
      // Body was not JSON
    }

    throw new ApiError(response.status, code, message, details);
  }

  return response.json();
}

/**
 * Fetch all movies ordered by releaseYear ascending, then title
 */
export async function getMovies(): Promise<Movie[]> {
  return request<Movie[]>("/movies");
}

/**
 * Create one movie or a batch of movies
 */
export async function createMovie(
  data: CreateMoviePayload | CreateMoviePayload[]
): Promise<Movie | Movie[]> {
  return request<Movie | Movie[]>("/movies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Partially update movie attributes or prerequisites
 */
export async function updateMovie(
  id: string,
  partial: UpdateMoviePayload
): Promise<Movie> {
  return request<Movie>(`/movies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(partial),
  });
}

/**
 * Get topological rewatch order for a movie
 */
export async function getRewatchOrder(id: string): Promise<RewatchOrder> {
  return request<RewatchOrder>(`/movies/${id}/rewatch-order`);
}

/**
 * Fetch all cinemas ordered by name
 */
export async function getCinemas(): Promise<Cinema[]> {
  return request<Cinema[]>("/cinemas");
}

/**
 * Create one cinema or a batch of cinemas
 */
export async function createCinema(
  data: CreateCinemaPayload | CreateCinemaPayload[]
): Promise<Cinema | Cinema[]> {
  return request<Cinema | Cinema[]>("/cinemas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Calculate the minimum bundle allocation for a squad group size
 */
export async function getBookingQuote(
  cinemaId: string,
  groupSize: number
): Promise<BookingQuote> {
  return request<BookingQuote>(
    `/cinemas/${cinemaId}/booking?groupSize=${groupSize}`
  );
}

