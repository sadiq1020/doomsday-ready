"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ShieldCheck, Film } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Counter } from "@/components/ui/counter";
import { formatRuntime } from "@/lib/format";
import type { RewatchOrderItem, RewatchOrderSummary } from "@/types/api";

interface PlanBriefingProps {
  summary: RewatchOrderSummary;
  order: RewatchOrderItem[];
  targetTitle: string;
}

export function PlanBriefing({
  summary,
  order,
  targetTitle,
}: PlanBriefingProps) {
  const isAllWatched = summary.total > 0 && summary.unwatched === 0;
  const formattedTime = useMemo(
    () => formatRuntime(summary.remainingRuntimeMinutes),
    [summary.remainingRuntimeMinutes]
  );

  return (
    <div className="sticky top-24 space-y-5">
      <SpotlightCard
        withTicks
        className={`p-6 space-y-6 transition-all duration-500 ${
          isAllWatched
            ? "border-verdigris/50 shadow-[0_0_35px_rgba(79,181,152,0.15)] ring-1 ring-verdigris/30"
            : "border-brass/30 bg-ink-2"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brass/15 pb-4">
          <div className="space-y-0.5">
            <span className="label-mono">MISSION TELEMETRY</span>
            <h3 className="font-display text-xl text-paper">Briefing</h3>
          </div>
          {isAllWatched ? (
            <span className="text-[10px] font-mono uppercase tracking-wider text-verdigris bg-verdigris/10 border border-verdigris/30 px-2 py-0.5 rounded-[2px] animate-pulse">
              ALL OBJECTIVES SECURED
            </span>
          ) : (
            <span className="text-[10px] font-mono uppercase tracking-wider text-brass-bright bg-brass/10 border border-brass/30 px-2 py-0.5 rounded-[2px]">
              IN PROGRESS
            </span>
          )}
        </div>

        {/* Segmented Progress Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-paper-dim uppercase tracking-wider">
              PREREQUISITE CHAIN
            </span>
            <span className="text-paper font-semibold">
              <Counter value={summary.watched} /> of {summary.total} watched
            </span>
          </div>

          {/* One segment per movie in order */}
          <div className="flex items-center gap-1.5 w-full">
            {order.map((item, index) => (
              <div
                key={item.id}
                className="flex-1 h-2 rounded-[1px] bg-ink border border-brass/20 overflow-hidden relative"
                title={`${item.title} (${item.watched ? "Watched" : "Unwatched"})`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    opacity: item.watched ? 1 : 0,
                    scaleX: item.watched ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  style={{ originX: 0 }}
                  className="w-full h-full bg-verdigris"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Watch Time */}
        <div className="space-y-1.5 pt-2 border-t border-brass/10">
          <span className="label-mono text-paper-dim flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ember" />
            REMAINING WATCH TIME
          </span>

          <div className="h-14 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={formattedTime}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="font-display text-4xl sm:text-5xl text-ember font-normal tracking-tight"
              >
                {formattedTime}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="font-mono text-[11px] text-paper-dim">
            {summary.unwatched > 0
              ? `${summary.unwatched} unverified screening(s) to view`
              : "Zero outstanding prerequisite runtime"}
          </p>
        </div>

        {/* Celebratory State when all watched */}
        {isAllWatched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-brass/10 border border-brass/40 rounded-[2px] space-y-1 text-center shadow-[0_0_25px_rgba(201,162,75,0.2)] animate-pulse"
          >
            <div className="inline-flex items-center gap-1.5 text-brass-bright font-mono text-xs uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-brass-bright" />
              <span>You are ready.</span>
            </div>
            <p className="font-body text-xs text-paper-dim">
              All narrative timelines converged. Prepared for opening night.
            </p>
          </motion.div>
        )}

        {/* Target Film Label at Bottom */}
        <div className="pt-3 border-t border-brass/15 flex items-center gap-2 text-xs font-mono text-paper-dim">
          <Film className="w-3.5 h-3.5 text-brass shrink-0" />
          <span className="truncate">
            Ready for:{" "}
            <strong className="text-brass-bright font-medium">{targetTitle}</strong>
          </span>
        </div>
      </SpotlightCard>
    </div>
  );
}

