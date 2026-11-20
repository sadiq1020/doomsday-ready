"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Building2, Plus, AlertCircle, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCinema } from "@/hooks/use-cinemas";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api";

interface CinemaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CinemaDrawer({ isOpen, onClose }: CinemaDrawerProps) {
  const [name, setName] = useState("");
  const [bundleInput, setBundleInput] = useState("");
  const [bundleChips, setBundleChips] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ name?: string; bundles?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createCinemaMutation = useCreateCinema();
  const { success, error: toastError } = useToast();

  const handleClose = () => {
    setName("");
    setBundleInput("");
    setBundleChips([]);
    setErrors({});
    setServerError(null);
    onClose();
  };

  const handleAddChip = () => {
    const parsed = parseInt(bundleInput.trim(), 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 500) {
      setErrors((prev) => ({
        ...prev,
        bundles: "Each bundle size must be an integer between 1 and 500 seats.",
      }));
      return;
    }

    if (bundleChips.includes(parsed)) {
      setErrors((prev) => ({
        ...prev,
        bundles: `Bundle size ${parsed} is already added. No duplicates allowed.`,
      }));
      return;
    }

    if (bundleChips.length >= 10) {
      setErrors((prev) => ({
        ...prev,
        bundles: "Maximum of 10 bundle sizes allowed per cinema partner.",
      }));
      return;
    }

    setBundleChips((prev) => [...prev, parsed].sort((a, b) => a - b));
    setBundleInput("");
    setErrors((prev) => ({ ...prev, bundles: undefined }));
  };

  const handleRemoveChip = (sizeToRemove: number) => {
    setBundleChips((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const validate = (): boolean => {
    const nextErrors: { name?: string; bundles?: string } = {};

    if (!name.trim()) {
      nextErrors.name = "Cinema name is required.";
    }

    // If user typed something in input without pressing add
    let currentChips = [...bundleChips];
    if (bundleInput.trim()) {
      const parsed = parseInt(bundleInput.trim(), 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 500 && !currentChips.includes(parsed)) {
        currentChips.push(parsed);
        currentChips.sort((a, b) => a - b);
        setBundleChips(currentChips);
        setBundleInput("");
      }
    }

    if (currentChips.length === 0) {
      nextErrors.bundles = "At least 1 bundle size is required (1-10 allowed).";
    } else if (currentChips.length > 10) {
      nextErrors.bundles = "Maximum 10 bundle sizes allowed.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    let finalChips = [...bundleChips];
    if (bundleInput.trim()) {
      const parsed = parseInt(bundleInput.trim(), 10);
      if (!isNaN(parsed) && !finalChips.includes(parsed)) {
        finalChips.push(parsed);
      }
    }

    createCinemaMutation.mutate(
      { name: name.trim(), bundleSizes: finalChips },
      {
        onSuccess: (result) => {
          const cinemaName = Array.isArray(result) ? result[0]?.name : result.name;
          success("Venue registered", cinemaName);
          handleClose();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            setServerError(err.message);
          } else {
            setServerError("An unexpected error occurred while creating the venue.");
          }
          toastError("Registration failed", err.message);
        },
      }
    );
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
            onClick={handleClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-40"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ink-2 border-l border-brass/30 z-50 shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brass/20 pb-4 mb-6">
              <div className="space-y-1">
                <span className="label-mono">NEW VENUE DIRECTORY ENTRY</span>
                <h3 className="font-display text-2xl text-paper">
                  Add Cinema
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-paper-dim hover:text-paper hover:bg-ink-3 rounded-[2px] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-6 p-4 bg-ember/10 border border-ember/30 rounded-[2px] flex items-start gap-3 text-ember">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <span className="font-mono uppercase font-bold">
                    REGISTRATION ERROR
                  </span>
                  <p className="font-body text-paper">{serverError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="label-mono block" htmlFor="cinema-name">
                  Cinema Name *
                </label>
                <Input
                  id="cinema-name"
                  placeholder="e.g. Apex Dolby Cinema"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={Boolean(errors.name)}
                  disabled={createCinemaMutation.isPending}
                />
                {errors.name && (
                  <p className="text-xs text-ember font-mono mt-1">{errors.name}</p>
                )}
              </div>

              {/* Bundle sizes as chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="label-mono block" htmlFor="bundle-chip-input">
                    Bundle Sizes (1-10 sizes, 1-500 seats each) *
                  </label>
                  <span className="text-[11px] font-mono text-paper-dim">
                    {bundleChips.length}/10 sizes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    id="bundle-chip-input"
                    type="number"
                    min={1}
                    max={500}
                    placeholder="Enter size (1-500) e.g. 4"
                    value={bundleInput}
                    onChange={(e) => setBundleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddChip();
                      }
                    }}
                    error={Boolean(errors.bundles)}
                    disabled={createCinemaMutation.isPending || bundleChips.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddChip}
                    disabled={!bundleInput.trim() || bundleChips.length >= 10}
                    className="shrink-0 text-xs"
                  >
                    Add Size
                  </Button>
                </div>

                {errors.bundles && (
                  <p className="text-xs text-ember font-mono">{errors.bundles}</p>
                )}

                {/* Displayed chips with remove button */}
                <div className="p-3 bg-ink rounded-[2px] border border-brass/20 min-h-16 flex flex-wrap gap-2 items-center">
                  {bundleChips.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass/20 text-brass-bright border border-brass/40 text-xs font-mono rounded-[2px]"
                    >
                      <Ticket className="w-3 h-3 text-brass/80" />
                      <span>{size} {size === 1 ? "seat" : "seats"}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip(size)}
                        className="text-paper-dim hover:text-ember transition-colors cursor-pointer ml-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  {bundleChips.length === 0 && (
                    <span className="text-xs font-mono text-paper-dim/60">
                      No bundle sizes added yet. Type a number and click Add Size.
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-brass/20 flex items-center justify-end gap-3 mt-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={createCinemaMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={createCinemaMutation.isPending}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {createCinemaMutation.isPending
                      ? "Adding Venue..."
                      : "Add Cinema"}
                  </span>
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
