"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Building2, Plus, AlertCircle } from "lucide-react";
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
  const [errors, setErrors] = useState<{ name?: string; bundles?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const createCinemaMutation = useCreateCinema();
  const { success, error: toastError } = useToast();

  const handleClose = () => {
    setName("");
    setBundleInput("");
    setErrors({});
    setServerError(null);
    onClose();
  };

  const validate = (): boolean => {
    const nextErrors: { name?: string; bundles?: string } = {};

    if (!name.trim()) {
      nextErrors.name = "Cinema name is required";
    }

    if (!bundleInput.trim()) {
      nextErrors.bundles = "At least one bundle size is required";
    } else {
      const parts = bundleInput
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const nums = parts.map((p) => Number(p));
      const hasInvalid = nums.some((n) => isNaN(n) || n < 1 || !Number.isInteger(n));
      if (hasInvalid) {
        nextErrors.bundles = "Bundle sizes must be positive integers (e.g., 1, 3, 5)";
      } else if (new Set(nums).size !== nums.length) {
        nextErrors.bundles = "Bundle sizes must all be unique";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    const parts = bundleInput
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const bundleSizes = parts.map((p) => Number(p));

    createCinemaMutation.mutate(
      { name: name.trim(), bundleSizes },
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
                  Register Cinema Partner
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
                  placeholder="e.g. Vibranium IMAX Screens"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={Boolean(errors.name)}
                  disabled={createCinemaMutation.isPending}
                />
                {errors.name && (
                  <p className="text-xs text-ember font-mono mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="label-mono block" htmlFor="bundle-sizes">
                  Seat Bundle Sizes *
                </label>
                <Input
                  id="bundle-sizes"
                  placeholder="e.g. 2, 4, 8 (comma or space separated)"
                  value={bundleInput}
                  onChange={(e) => setBundleInput(e.target.value)}
                  error={Boolean(errors.bundles)}
                  disabled={createCinemaMutation.isPending}
                />
                {errors.bundles && (
                  <p className="text-xs text-ember font-mono mt-1">
                    {errors.bundles}
                  </p>
                )}
                <p className="text-[11px] font-mono text-paper-dim">
                  Specify positive integer seat counts available per bundle pass.
                </p>
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
                      ? "Registering..."
                      : "Register Venue"}
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

