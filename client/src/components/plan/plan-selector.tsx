"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Crosshair, Search } from "lucide-react";
import type { Movie } from "@/types/api";

interface PlanSelectorProps {
  movies: Movie[];
  selectedMovieId: string | null;
  onSelectMovie: (id: string) => void;
  isLoading?: boolean;
}

export function PlanSelector({
  movies,
  selectedMovieId,
  onSelectMovie,
  isLoading,
}: PlanSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
  }, [movies]);

  const selectedMovie = useMemo(() => {
    return movies.find((m) => m.id === selectedMovieId) ?? null;
  }, [movies, selectedMovieId]);

  const filteredMovies = useMemo(() => {
    if (!search.trim()) return sortedMovies;
    const query = search.toLowerCase();
    return sortedMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        String(m.releaseYear).includes(query)
    );
  }, [sortedMovies, search]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="label-mono flex items-center gap-1.5" htmlFor="target-picker">
          <Crosshair className="w-3.5 h-3.5 text-brass" />
          <span>TARGET OBJECTIVE PICKER</span>
        </label>
        <span className="text-[11px] font-mono text-paper-dim">
          Select target film to generate briefing
        </span>
      </div>

      <div className="relative">
        <button
          id="target-picker"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={isLoading || movies.length === 0}
          className="w-full text-left bg-ink-2 hover:bg-ink-3 border border-brass/30 hover:border-brass/60 rounded-[3px] p-4 transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brass"
        >
          {selectedMovie ? (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 overflow-hidden">
              <span className="font-display text-xl sm:text-2xl text-paper truncate">
                {selectedMovie.title}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-paper-dim">
                <span>({selectedMovie.releaseYear})</span>
                <span>•</span>
                <span>{selectedMovie.runtime} MIN</span>
                <span>•</span>
                <span>
                  {selectedMovie.prerequisites.length}{" "}
                  {selectedMovie.prerequisites.length === 1
                    ? "PREREQUISITE"
                    : "PREREQUISITES"}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-body text-sm text-paper-dim">
              {isLoading
                ? "Accessing intelligence database..."
                : "Select a movie to resolve its rewatch sequence..."}
            </span>
          )}

          <ChevronDown
            className={`w-5 h-5 text-brass transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-ink-2 border border-brass/40 rounded-[3px] shadow-2xl p-3 space-y-2 max-h-80 overflow-hidden flex flex-col">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-paper-dim absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by title or year..."
                  className="w-full bg-ink border border-brass/25 text-xs font-mono text-paper pl-9 pr-3 py-2 rounded-[2px] placeholder:text-paper-dim/50 focus:outline-none focus:border-brass"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto space-y-1 pr-1 flex-1">
                {filteredMovies.map((movie) => {
                  const isSelected = movie.id === selectedMovieId;
                  return (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => {
                        onSelectMovie(movie.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-[2px] transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-brass/20 text-brass-bright border border-brass/40"
                          : "text-paper hover:bg-ink-3 hover:text-paper"
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-body text-sm font-medium truncate">
                          {movie.title}
                        </div>
                        <div className="text-[11px] font-mono text-paper-dim">
                          {movie.releaseYear} • {movie.runtime}m •{" "}
                          {movie.prerequisites.length} prerequisite(s)
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-mono uppercase text-brass bg-brass/10 px-1.5 py-0.5 rounded-[2px] shrink-0">
                          Active Target
                        </span>
                      )}
                    </button>
                  );
                })}

                {filteredMovies.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-paper-dim">
                    No matching films found in registry.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
