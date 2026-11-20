"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, SlidersHorizontal } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/api";

export interface MovieCardProps {
  movie: Movie;
  onToggleWatched: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export function MovieCard({
  movie,
  onToggleWatched,
  onEdit,
}: MovieCardProps) {
  return (
    <SpotlightCard
      withTicks
      className="flex flex-col justify-between gap-5 h-full transition-all duration-200"
    >
      {/* Top Header: Year Numeral and Watched Toggle Stamp */}
      <div className="flex items-start justify-between gap-4">
        {/* Large Fraunces Release Year Numeral */}
        <span
          aria-label={`Released in ${movie.releaseYear}`}
          className="font-display text-4xl sm:text-5xl font-light text-brass/30 select-none tracking-tight leading-none"
        >
          {movie.releaseYear}
        </span>

        {/* Custom Animated Watched Toggle / Stamp */}
        <button
          type="button"
          onClick={() => onToggleWatched(movie)}
          aria-label={`Mark ${movie.title} as ${movie.watched ? "unwatched" : "watched"}`}
          className="group relative cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded-[2px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {movie.watched ? (
              <motion.div
                key="watched-stamp"
                initial={{ scale: 0.75, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: -2 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-verdigris/50 bg-verdigris/15 text-verdigris shadow-[0_0_12px_rgba(79,181,152,0.2)]"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span className="font-mono text-[0.625rem] font-bold tracking-[0.2em] uppercase">
                  WATCHED
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="unwatched-box"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border border-hairline bg-ink-3 text-paper-dim hover:border-brass/50 hover:text-paper transition-colors"
              >
                <div className="h-2.5 w-2.5 rounded-[1px] border border-paper-dim/40 group-hover:border-brass" />
                <span className="font-mono text-[0.625rem] tracking-[0.14em] uppercase">
                  UNWATCHED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Middle Section: Title and Runtime */}
      <div className="space-y-1.5">
        <h3 className="font-display text-xl sm:text-2xl font-medium text-paper leading-snug">
          {movie.title}
        </h3>
        <p className="font-mono text-xs text-paper-dim uppercase tracking-[0.16em]">
          {movie.runtime} MIN
        </p>
      </div>

      {/* Prerequisites Section */}
      <div className="space-y-2 pt-3 border-t border-hairline/60">
        <span className="label-mono text-[0.625rem]">
          REQUIRED PREREQUISITES
        </span>
        <div className="flex flex-wrap gap-1.5 min-h-[1.75rem]">
          {movie.prerequisites && movie.prerequisites.length > 0 ? (
            movie.prerequisites.map((p) => (
              <Chip
                key={p.id}
                variant="brass"
                size="sm"
                className="text-[0.625rem] font-mono tracking-wider"
              >
                {p.title}
              </Chip>
            ))
          ) : (
            <span className="font-mono text-[0.6875rem] text-paper-dim/50 italic">
              None cataloged
            </span>
          )}
        </div>
      </div>

      {/* Footer Action: Edit Requirements */}
      <div className="pt-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(movie)}
          className="text-[0.6875rem]"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Edit requirements
        </Button>
      </div>
    </SpotlightCard>
  );
}

