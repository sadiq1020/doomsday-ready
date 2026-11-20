// Movie prerequisite reference
export interface MoviePrerequisiteRef {
  id: string;
  title: string;
}

// Full movie record matching the backend response shape
export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
  prerequisites: MoviePrerequisiteRef[];
}

// Payload for creating a movie
export interface CreateMoviePayload {
  title: string;
  releaseYear: number;
  runtime: number;
  watched?: boolean;
  prerequisiteIds?: string[];
}

// Payload for partially updating a movie
export interface UpdateMoviePayload {
  title?: string;
  releaseYear?: number;
  runtime?: number;
  watched?: boolean;
  prerequisiteIds?: string[];
}

// Rewatch order response item
export interface RewatchOrderItem {
  id: string;
  title: string;
  releaseYear: number;
  runtime: number;
  watched: boolean;
}

// Rewatch order summary
export interface RewatchOrderSummary {
  total: number;
  watched: number;
  unwatched: number;
  remainingRuntimeMinutes: number;
}

// Full rewatch order response shape
export interface RewatchOrder {
  target: {
    id: string;
    title: string;
  };
  order: RewatchOrderItem[];
  summary: RewatchOrderSummary;
}

// Cinema record
export interface Cinema {
  id: string;
  name: string;
  bundleSizes: number[];
}

// Payload for creating a cinema
export interface CreateCinemaPayload {
  name: string;
  bundleSizes: number[];
}

// Bundle allocation breakdown item
export interface BundleAllocation {
  size: number;
  count: number;
}

// Booking quote response shape
export interface BookingQuote {
  cinema: Cinema;
  groupSize: number;
  possible: boolean;
  totalBundles: number;
  breakdown: BundleAllocation[];
  message: string;
}

// Centralized API error response format
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

