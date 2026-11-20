"use client";

import { motion, AnimatePresence } from "motion/react";
import { Clock } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useUpdateMovie } from "@/hooks/use-movies";
import { useToast } from "@/components/ui/toast";
import type { RewatchOrderItem } from "@/types/api";

interface PlanPathProps {
  order: RewatchOrderItem[];
  targetId: string;
}

export function PlanPath({ order, targetId }: PlanPathProps) {
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
      <div className="flex items-center justify-between pb-2">
        <span className="label-mono">
          TOPOLOGICAL REWATCH SEQUENCE ({order.length} STEPS)
        </span>
        <span className="text-[11px] font-mono text-paper-dim">
          POST-ORDER DFS ORDERING
        </span>
      </div>

      <div className="relative pl-8 sm:pl-10 space-y-6 my-2">
        {/* Continuous thin vertical brass line that draws itself in */}
        <motion.div
          key={`line-${targetId}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ originY: 0 }}
          className="absolute left-[13px] sm:left-[17px] top-6 bottom-6 w-[2px] bg-brass/25"
        />

        <AnimatePresence mode="popLayout">
          {order.map((item, index) => {
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Interactive Node: Click to Toggle Watched */}
                <button
                  type="button"
                  onClick={() => handleToggleWatched(item)}
                  title={item.watched ? "Click to unwatch" : "Click to mark watched"}
                  className={`absolute -left-[30px] sm:-left-[38px] top-5 w-7 h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer z-10 focus:outline-none focus:ring-2 focus:ring-brass ${
                    item.watched
                      ? "bg-verdigris border-verdigris shadow-[0_0_12px_rgba(79,181,152,0.4)]"
                      : "bg-ink border-brass hover:border-brass-bright hover:bg-brass/10"
                  }`}
                >
                  {item.watched ? (
                    <svg
                      className="w-3.5 h-3.5 text-ink"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </svg>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass/40" />
                  )}
                </button>

                {/* Node Card */}
                <SpotlightCard
                  onClick={() => handleToggleWatched(item)}
                  className={`p-5 transition-all duration-300 cursor-pointer text-left select-none ${
                    item.watched
                      ? "bg-ink-2/60 border-verdigris/25 hover:border-verdigris/40"
                      : "bg-ink-2 border-brass/25 hover:border-brass/50 hover:bg-ink-3/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Step index in mono */}
                      <span className="font-mono text-sm sm:text-base text-brass/70 tracking-widest pt-0.5 shrink-0">
                        {stepNumber}.
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`font-display text-lg sm:text-xl transition-all duration-200 ${
                              item.watched
                                ? "text-paper-dim/60 line-through decoration-brass/40"
                                : "text-paper hover:text-brass-bright"
                            }`}
                          >
                            {item.title}
                          </h4>

                          {item.watched && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-verdigris bg-verdigris/10 border border-verdigris/30 px-1.5 py-0.2 rounded-[2px]">
                              WATCHED
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

                    <div className="text-right sm:self-center shrink-0">
                      <span className="text-[11px] font-mono text-paper-dim hover:text-paper uppercase tracking-wider">
                        {item.watched ? "Click to unwatch" : "Click to watch"} &rarr;
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

