"use client";

import { motion } from "motion/react";
import { Check, Clock } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useUpdateMovie } from "@/hooks/use-movies";
import { useToast } from "@/components/ui/toast";
import type { RewatchOrderItem } from "@/types/api";

interface PlanTimelineProps {
  order: RewatchOrderItem[];
}

export function PlanTimeline({ order }: PlanTimelineProps) {
  const updateMovieMutation = useUpdateMovie();
  const { success, error } = useToast();

  const handleToggleWatched = (item: RewatchOrderItem) => {
    const nextWatched = !item.watched;
    updateMovieMutation.mutate(
      {
        id: item.id,
        payload: { watched: nextWatched },
      },
      {
        onSuccess: (updated) => {
          success(
            updated.watched ? "Marked as watched" : "Marked as unwatched",
            updated.title
          );
        },
        onError: (err) => {
          error("Update failed", err.message);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="label-mono">
          TOPOLOGICAL REWATCH SEQUENCE ({order.length} STEPS)
        </span>
        <span className="text-[11px] font-mono text-paper-dim">
          POST-ORDER DFS ORDERING
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-4 border-l border-brass/20 my-2">
        {order.map((item, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");
          const isPending = updateMovieMutation.isPending;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative"
            >
              {/* Chronological Step Marker on Timeline */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-[2px] border transition-colors flex items-center justify-center ${
                  item.watched
                    ? "bg-verdigris border-verdigris text-ink"
                    : "bg-ink border-brass/40 text-transparent"
                }`}
              >
                {item.watched && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>

              <SpotlightCard
                className={`p-5 transition-all duration-300 ${
                  item.watched
                    ? "bg-ink-2/60 border-verdigris/25"
                    : "bg-ink-2 border-brass/25 hover:border-brass/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Step number + Movie Details */}
                  <div className="flex items-start gap-4">
                    <span className="font-display text-2xl sm:text-3xl text-brass/40 leading-none shrink-0 pt-0.5">
                      {stepNumber}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4
                          className={`font-display text-lg sm:text-xl transition-colors ${
                            item.watched
                              ? "text-paper-dim line-through decoration-brass/30"
                              : "text-paper"
                          }`}
                        >
                          {item.title}
                        </h4>

                        {item.watched && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-verdigris bg-verdigris/10 border border-verdigris/30 px-1.5 py-0.5 rounded-[2px]">
                            VERIFIED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-paper-dim">
                        <span>{item.releaseYear}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brass/60" />
                          {item.runtime} MIN
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Interactive Watched Toggle */}
                  <div className="sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleWatched(item)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                        item.watched
                          ? "bg-verdigris/15 text-verdigris border-verdigris/35 hover:bg-verdigris/25"
                          : "bg-ink-3 text-paper-dim border-brass/20 hover:border-brass/50 hover:text-paper"
                      }`}
                      title={item.watched ? "Mark as unwatched" : "Mark as watched"}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-[1px] border flex items-center justify-center transition-colors ${
                          item.watched
                            ? "bg-verdigris border-verdigris text-ink"
                            : "border-paper-dim/40 bg-ink"
                        }`}
                      >
                        {item.watched && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                      <span>{item.watched ? "Watched" : "Mark Watched"}</span>
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

