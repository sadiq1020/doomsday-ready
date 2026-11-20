// Centralized query key factory for predictable cache invalidation
export const movieKeys = {
  all: ["movies"] as const,
  list: () => [...movieKeys.all, "list"] as const,
  allRewatchOrders: () => [...movieKeys.all, "rewatch-order"] as const,
  rewatchOrder: (id: string) => [...movieKeys.all, "rewatch-order", id] as const,
};

export const cinemaKeys = {
  all: ["cinemas"] as const,
  list: () => [...cinemaKeys.all, "list"] as const,
  booking: (cinemaId: string, groupSize: number) =>
    [...cinemaKeys.all, "booking", cinemaId, groupSize] as const,
};

