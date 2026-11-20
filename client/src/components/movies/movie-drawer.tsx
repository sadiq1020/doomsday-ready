"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import type { Movie, CreateMoviePayload, UpdateMoviePayload } from "@/types/api";
import { ApiError } from "@/lib/api";

export interface MovieDrawerProps {
  isOpen: boolean;
  movie: Movie | null; // null = Add mode, Movie = Edit mode
  availableMovies: Movie[];
  onClose: () => void;
  onSubmitCreate: (payload: CreateMoviePayload) => Promise<any>;
  onSubmitUpdate: (id: string, payload: UpdateMoviePayload) => Promise<any>;
}

export function MovieDrawer({
  isOpen,
  movie,
  availableMovies,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: MovieDrawerProps) {
  const isEditing = Boolean(movie);

  // Form Fields
  const [title, setTitle] = React.useState("");
  const [releaseYear, setReleaseYear] = React.useState<number>(2024);
  const [runtime, setRuntime] = React.useState<number>(120);
  const [selectedPrereqIds, setSelectedPrereqIds] = React.useState<string[]>([]);

  // Search filter for prerequisite picker
  const [searchQuery, setSearchQuery] = React.useState("");

  // Error States
  const [formError, setFormError] = React.useState<string | null>(null);
  const [titleError, setTitleError] = React.useState<string | null>(null);
  const [runtimeError, setRuntimeError] = React.useState<string | null>(null);
  const [yearError, setYearError] = React.useState<string | null>(null);
  const [isCircularError, setIsCircularError] = React.useState(false);
  const [isShaking, setIsShaking] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Synchronize form when opened or movie changed
  React.useEffect(() => {
    if (isOpen) {
      if (movie) {
        setTitle(movie.title);
        setReleaseYear(movie.releaseYear);
        setRuntime(movie.runtime);
        setSelectedPrereqIds(movie.prerequisites?.map((p) => p.id) || []);
      } else {
        setTitle("");
        setReleaseYear(new Date().getFullYear());
        setRuntime(120);
        setSelectedPrereqIds([]);
      }
      setSearchQuery("");
      setFormError(null);
      setTitleError(null);
      setRuntimeError(null);
      setYearError(null);
      setIsCircularError(false);
      setIsShaking(false);
    }
  }, [isOpen, movie]);

  // Handle Escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Movies eligible as prerequisites:
  // Must exclude the movie itself if editing
  const eligibleMovies = React.useMemo(() => {
    return availableMovies.filter((m) => {
      if (movie && m.id === movie.id) return false;
      return true;
    });
  }, [availableMovies, movie]);

  // Filtered candidate list based on search query
  const searchResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return eligibleMovies.filter((m) => {
      const isAlreadySelected = selectedPrereqIds.includes(m.id);
      if (isAlreadySelected) return false;
      if (!query) return true;
      return (
        m.title.toLowerCase().includes(query) ||
        String(m.releaseYear).includes(query)
      );
    });
  }, [eligibleMovies, selectedPrereqIds, searchQuery]);

  // Toggle prerequisite addition / removal
  const addPrereq = (id: string) => {
    if (!selectedPrereqIds.includes(id)) {
      setSelectedPrereqIds((prev) => [...prev, id]);
    }
  };

  const removePrereq = (id: string) => {
    setSelectedPrereqIds((prev) => prev.filter((item) => item !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setFormError(null);
    setTitleError(null);
    setRuntimeError(null);
    setYearError(null);
    setIsCircularError(false);

    // Client-side validations
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required.");
      return;
    }

    if (!runtime || runtime < 1 || runtime > 300) {
      setRuntimeError("Runtime must be between 1 and 300 minutes.");
      return;
    }

    if (!releaseYear || releaseYear < 1900 || releaseYear > 2100) {
      setYearError("Please provide a valid release year (1900-2100).");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && movie) {
        await onSubmitUpdate(movie.id, {
          title: trimmedTitle,
          releaseYear,
          runtime,
          prerequisiteIds: selectedPrereqIds,
        });
      } else {
        await onSubmitCreate({
          title: trimmedTitle,
          releaseYear,
          runtime,
          prerequisiteIds: selectedPrereqIds,
          watched: false,
        });
      }
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.code === "DUPLICATE_TITLE") {
          setTitleError(err.message);
        } else if (err.code === "CIRCULAR_DEPENDENCY") {
          setIsCircularError(true);
          setFormError(err.message);
          // Trigger shake animation
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError(err?.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-grayscale"
            aria-hidden="true"
          />

          {/* Right-Side Drawer Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              ...(isShaking && {
                x: [-12, 12, -8, 8, -4, 4, 0],
                transition: { duration: 0.5 },
              }),
            }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-ink-2 border-l border-hairline p-6 sm:p-8 flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-6 border-b border-hairline">
              <div>
                <span className="label-mono">
                  {isEditing ? "RECORD MUTATION" : "ENTRY REGISTRATION"}
                </span>
                <h2
                  id="drawer-title"
                  className="font-display text-2xl font-medium text-paper mt-1"
                >
                  {isEditing ? "Edit Requirements" : "Add New Film"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="text-paper-dim hover:text-paper rounded-[2px] p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Server Error / Circular Dependency Banner */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-[3px] border ${
                  isCircularError
                    ? "border-ember/60 bg-ember/15 text-ember shadow-[0_0_15px_rgba(228,87,46,0.15)]"
                    : "border-ember/40 bg-ember/10 text-ember"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-ember" />
                  <div className="space-y-1">
                    {isCircularError && (
                      <span className="font-mono text-[0.625rem] font-bold tracking-[0.2em] uppercase text-ember block">
                        LOOP DETECTED // 409 CONFLICT
                      </span>
                    )}
                    <p className="font-body text-xs text-ember leading-relaxed">
                      {formError}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex-1 space-y-6">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="movie-title"
                  className="label-mono block text-[0.6875rem]"
                >
                  FILM TITLE *
                </label>
                <Input
                  id="movie-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Captain America: Brave New World"
                  error={Boolean(titleError)}
                />
                {titleError && (
                  <p className="font-mono text-[0.6875rem] text-ember mt-1">
                    {titleError}
                  </p>
                )}
              </div>

              {/* Release Year and Runtime Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="movie-year"
                    className="label-mono block text-[0.6875rem]"
                  >
                    RELEASE YEAR *
                  </label>
                  <Input
                    id="movie-year"
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    min={1900}
                    max={2100}
                    error={Boolean(yearError)}
                  />
                  {yearError && (
                    <p className="font-mono text-[0.6875rem] text-ember mt-1">
                      {yearError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="movie-runtime"
                    className="label-mono block text-[0.6875rem]"
                  >
                    RUNTIME (MINUTES) *
                  </label>
                  <Input
                    id="movie-runtime"
                    type="number"
                    value={runtime}
                    onChange={(e) => setRuntime(Number(e.target.value))}
                    min={1}
                    max={300}
                    error={Boolean(runtimeError)}
                  />
                  {runtimeError && (
                    <p className="font-mono text-[0.6875rem] text-ember mt-1">
                      {runtimeError}
                    </p>
                  )}
                </div>
              </div>

              {/* Prerequisite Picker */}
              <div className="space-y-3 pt-4 border-t border-hairline/60">
                <div>
                  <label className="label-mono block text-[0.6875rem]">
                    PREREQUISITE DEPENDENCIES
                  </label>
                  <p className="font-body text-xs text-paper-dim mt-0.5">
                    Films that must strictly precede this feature in the rewatch order.
                  </p>
                </div>

                {/* Selected Prerequisite Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[2rem] p-2.5 rounded-[3px] bg-ink border border-hairline">
                  {selectedPrereqIds.length > 0 ? (
                    selectedPrereqIds.map((id) => {
                      const matched = eligibleMovies.find((m) => m.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-brass/15 text-brass-bright border border-brass/35 text-xs font-mono"
                        >
                          <span>{matched?.title || id}</span>
                          <button
                            type="button"
                            onClick={() => removePrereq(id)}
                            aria-label={`Remove prerequisite ${matched?.title || id}`}
                            className="text-brass/70 hover:text-paper rounded-xs transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="font-mono text-xs text-paper-dim/40 italic py-0.5">
                      No prerequisites selected (standalone feature)
                    </span>
                  )}
                </div>

                {/* Searchable Candidate List */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-paper-dim/60" />
                    <Input
                      type="text"
                      placeholder="Search catalog to add prerequisites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  {/* Scrollable Filtered Candidates */}
                  <div className="max-h-44 overflow-y-auto space-y-1 rounded-[3px] border border-hairline/60 bg-ink-3 p-1.5">
                    {searchResults.length > 0 ? (
                      searchResults.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => addPrereq(m.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-[2px] text-xs font-body hover:bg-ink-2 hover:text-brass flex items-center justify-between text-paper transition-colors group"
                        >
                          <span className="truncate pr-2">{m.title}</span>
                          <span className="font-mono text-[0.625rem] text-paper-dim group-hover:text-brass">
                            +{m.releaseYear}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-3 text-xs font-mono text-paper-dim/40">
                        {searchQuery ? "No matching films" : "All available films added"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-hairline flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Create Film"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

