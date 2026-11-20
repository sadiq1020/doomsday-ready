"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChapterHeader } from "@/components/chapter-header";
import { useMovies, useRewatchOrder } from "@/hooks/use-movies";
import { PlanSelector } from "@/components/plan/plan-selector";
import { PlanBriefing } from "@/components/plan/plan-briefing";
import { PlanPath } from "@/components/plan/plan-path";
import { PlanEmpty } from "@/components/plan/plan-empty";

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTarget = searchParams.get("target");

  const { data: movies = [], isLoading: isLoadingMovies } = useMovies();

  // Find default target (latest release year, e.g. Doomsday)
  const defaultTargetId = useMemo(() => {
    if (movies.length === 0) return null;
    const sorted = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
    return sorted[0].id;
  }, [movies]);

  // Active target is URL target if valid, otherwise fallback to default
  const selectedMovieId = useMemo(() => {
    if (urlTarget && movies.some((m) => m.id === urlTarget)) {
      return urlTarget;
    }
    return defaultTargetId;
  }, [urlTarget, movies, defaultTargetId]);

  // Keep URL in sync with default if no param exists yet
  useEffect(() => {
    if (!urlTarget && defaultTargetId) {
      router.replace(`/plan?target=${defaultTargetId}`, { scroll: false });
    }
  }, [urlTarget, defaultTargetId, router]);

  const handleSelectMovie = (id: string) => {
    router.push(`/plan?target=${id}`, { scroll: false });
  };

  const {
    data: rewatchOrder,
    isLoading: isLoadingOrder,
    error: orderError,
    refetch: refetchOrder,
  } = useRewatchOrder(selectedMovieId);

  const selectedMovie = movies.find((m) => m.id === selectedMovieId);

  return (
    <div className="space-y-8">
      <ChapterHeader
        chapter="02"
        label="The Rewatch Path"
        title="The Rewatch Path"
        description="Select any target feature to compute its complete prerequisite chain in strict dependency order, accompanied by completion tracking and remaining mission runtime."
      />

      {/* Target Picker */}
      <PlanSelector
        movies={movies}
        selectedMovieId={selectedMovieId}
        onSelectMovie={handleSelectMovie}
        isLoading={isLoadingMovies}
      />

      {/* Main Content Area */}
      {isLoadingOrder || isLoadingMovies ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-48 bg-ink-2/60 rounded" />
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-64 bg-ink-2/60 border border-brass/15 rounded-[3px]" />
          </div>
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
        /* Asymmetric Layout: On mobile, Briefing is on top; on desktop, Left Path + Right Sticky Briefing */
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Column: The Rewatch Path Timeline */}
          <div className="lg:col-span-7">
            <PlanPath
              order={rewatchOrder.order}
              targetId={rewatchOrder.target.id}
            />
          </div>

          {/* Right / Sticky Column: Briefing Panel */}
          <div className="lg:col-span-5">
            <PlanBriefing
              summary={rewatchOrder.summary}
              order={rewatchOrder.order}
              targetTitle={rewatchOrder.target.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-pulse">
          <div className="h-12 w-64 bg-ink-2/60 rounded" />
          <div className="h-20 bg-ink-2/60 border border-brass/20 rounded" />
        </div>
      }
    >
      <PlanContent />
    </Suspense>
  );
}
