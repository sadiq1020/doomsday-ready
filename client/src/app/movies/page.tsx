"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Plus, AlertTriangle, RefreshCw, Film } from "lucide-react";
import { useMovies, useCreateMovie, useUpdateMovie } from "@/hooks/use-movies";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MovieCard } from "@/components/movies/movie-card";
import { MovieDrawer } from "@/components/movies/movie-drawer";
import { MovieListSkeleton } from "@/components/movies/movie-skeleton";
import type { Movie, CreateMoviePayload, UpdateMoviePayload } from "@/types/api";

export default function MoviesPage() {
  const { data: movies, isLoading, isError, error, refetch } = useMovies();
  const createMovieMutation = useCreateMovie();
  const updateMovieMutation = useUpdateMovie();
  const toast = useToast();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editingMovie, setEditingMovie] = React.useState<Movie | null>(null);

  // Handlers
  const handleOpenAdd = () => {
    setEditingMovie(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingMovie(null);
  };

  const handleToggleWatched = async (movie: Movie) => {
    const nextWatched = !movie.watched;
    try {
      await updateMovieMutation.mutateAsync({
        id: movie.id,
        payload: { watched: nextWatched },
      });
      toast.success(
        nextWatched ? "Film Watched" : "Marked Unwatched",
        `${movie.title} status updated.`
      );
    } catch (err: any) {
      toast.error(
        "Update Failed",
        err?.message || "Failed to toggle watched status."
      );
    }
  };

  const handleCreateSubmit = async (payload: CreateMoviePayload) => {
    await createMovieMutation.mutateAsync(payload);
    toast.success("Film Cataloged", `"${payload.title}" added to the archive.`);
  };

  const handleUpdateSubmit = async (id: string, payload: UpdateMoviePayload) => {
    await updateMovieMutation.mutateAsync({ id, payload });
    toast.success("Dossier Updated", `"${payload.title || "Film"}" requirements saved.`);
  };

  // Movie counts
  const totalCount = movies?.length || 0;
  const watchedCount = movies?.filter((m) => m.watched).length || 0;

  return (
    <div className="space-y-8">
      {/* Chapter 01 Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-mono text-3xl sm:text-4xl font-light text-brass/80 tracking-tighter">
              01
            </span>
            <span className="label-mono font-semibold text-brass">
              THE ARCHIVE
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-paper">
            Classified Cinematic Records
          </h1>
          <div className="flex items-center gap-2 mt-3 font-mono text-xs text-paper-dim">
            <span>
              {totalCount} {totalCount === 1 ? "RECORD CATALOGED" : "RECORDS CATALOGED"}
            </span>
            <span className="text-hairline">•</span>
            <span className="text-verdigris">{watchedCount} WATCHED</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleOpenAdd} variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Add Film
          </Button>
        </div>
      </div>

      {/* Main Content States */}
      {isLoading ? (
        <MovieListSkeleton />
      ) : isError ? (
        <div className="p-8 rounded-[3px] border border-ember/40 bg-ink-2 text-center space-y-4 max-w-lg mx-auto">
          <AlertTriangle className="h-8 w-8 text-ember mx-auto" />
          <h3 className="font-display text-lg text-paper">
            Failed to Load Dossier
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            {error?.message || "Could not connect to the remote database service."}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Connection
          </Button>
        </div>
      ) : !movies || movies.length === 0 ? (
        <div className="p-12 rounded-[3px] border border-dashed border-hairline bg-ink-2/50 text-center space-y-4 max-w-md mx-auto">
          <Film className="h-10 w-10 text-paper-dim/40 mx-auto" />
          <h3 className="font-display text-xl text-paper">No Records in Archive</h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            The archive currently contains no cataloged Marvel movies. Begin by
            adding the opening entry.
          </p>
          <Button onClick={handleOpenAdd} variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add First Film
          </Button>
        </div>
      ) : (
        /* 2-Column Asymmetric Grid with Staggered Entrance Animation */
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <MovieCard
                movie={movie}
                onToggleWatched={handleToggleWatched}
                onEdit={handleOpenEdit}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Slide-over Right Drawer for Adding / Editing Films */}
      <MovieDrawer
        isOpen={drawerOpen}
        movie={editingMovie}
        availableMovies={movies || []}
        onClose={handleCloseDrawer}
        onSubmitCreate={handleCreateSubmit}
        onSubmitUpdate={handleUpdateSubmit}
      />
    </div>
  );
}
