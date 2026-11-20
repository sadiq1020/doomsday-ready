"use client";

import { useEffect, useState } from "react";
import { ChapterHeader } from "@/components/chapter-header";
import { useMovies, useRewatchOrder } from "@/hooks/use-movies";
import { PlanSelector } from "@/components/plan/plan-selector";
import { PlanTelemetry } from "@/components/plan/plan-telemetry";
import { PlanTimeline } from "@/components/plan/plan-timeline";
import { PlanEmpty } from "@/components/plan/plan-empty";

export default function PlanPage() {
  const { data: movies = [], isLoading: isLoadingMovies } = useMovies();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Default to Avengers: Doomsday (or the latest film) once movies are loaded
  useEffect(() => {
    if (selectedMovieId === null && movies.length > 0) {
      const doomsday = movies.find((m) =>
        m.title.toLowerCase().includes("doomsday")
      );
      if (doomsday) {
        setSelectedMovieId(doomsday.id);
      } else {
        const sorted = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
        setSelectedMovieId(sorted[0].id);
      }
    }
  }, [movies, selectedMovieId]);

  const {
    data: rewatchOrder,
    isLoading: isLoadingOrder,
    error: orderError,
    refetch: refetchOrder,
  } = useRewatchOrder(selectedMovieId);

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);

  return (
    <div className="space-y-10">
      <ChapterHeader
        chapter="02"
        label="The Rewatch Path"
        title="Topological Rewatch Order"
        description="Topological dependency sequence computed via depth-first search. Every film appears strictly after its required prerequisites, ensuring zero narrative gaps prior to opening night."
      />

      {/* Target Selector */}
      <PlanSelector
        movies={movies}
        selectedMovieId={selectedMovieId}
        onSelectMovie={(id) => setSelectedMovieId(id)}
        isLoading={isLoadingMovies}
      />

      {/* Main Order Content */}
      <div className="space-y-8">
        {!selectedMovieId ? (
          <PlanEmpty type="no-target" />
        ) : isLoadingOrder ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
              <div className="h-24 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
              <div className="h-24 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
            </div>
            <div className="h-48 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
          </div>
        ) : orderError ? (
          <PlanEmpty
            type="error"
            errorMessage={orderError.message}
            onRetry={() => refetchOrder()}
          />
        ) : !rewatchOrder || rewatchOrder.order.length === 0 ? (
          <PlanEmpty
            type="no-prerequisites"
            targetTitle={selectedMovie?.title}
          />
        ) : (
          <>
            {/* Progress Bar & Telemetry Cards */}
            <PlanTelemetry
              summary={rewatchOrder.summary}
              targetTitle={rewatchOrder.target.title}
            />

            {/* Sequenced Topological Steps */}
            <PlanTimeline order={rewatchOrder.order} />
          </>
        )}
      </div>
    </div>
  );
}
