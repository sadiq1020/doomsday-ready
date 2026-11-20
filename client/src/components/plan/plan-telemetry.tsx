"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, Film, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { formatRuntime } from "@/lib/format";
import type { RewatchOrderSummary } from "@/types/api";

interface PlanTelemetryProps {
  summary: RewatchOrderSummary;
  targetTitle: string;
}

export function PlanTelemetry({ summary, targetTitle }: PlanTelemetryProps) {
  const percentage = useMemo(() => {
    if (summary.total === 0) return 100;
    return Math.round((summary.watched / summary.total) * 100);
  }, [summary.total, summary.watched]);

  const isAllWatched = summary.total > 0 && summary.unwatched === 0;

  return (
    <div className="space-y-4">
      {/* Visual Progress Bar Panel */}
      <SpotlightCard withTicks className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="label-mono">READINESS STATUS</span>
            <span className="font-mono text-xs text-paper-dim">
              // {summary.watched} OF {summary.total} PREREQUISITES VERIFIED
            </span>
          </div>
          <span className="font-mono text-xs text-brass-bright font-semibold">
            {percentage}% PREPARED
          </span>
        </div>

        {/* Custom Segmented Progress Bar */}
        <div className="relative w-full h-3 bg-ink rounded-[2px] border border-brass/25 overflow-hidden p-[2px]">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-[1px] ${
              isAllWatched ? "bg-verdigris" : "bg-brass"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isAllWatched ? (
          <div className="flex items-center gap-2 text-verdigris text-xs font-mono pt-1">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              All prerequisite intelligence secured. Ready for {targetTitle} opening night.
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs font-mono text-paper-dim pt-1">
            <span>{summary.unwatched} required screening(s) remaining</span>
            <span>Est. {formatRuntime(summary.remainingRuntimeMinutes)}</span>
          </div>
        )}
      </SpotlightCard>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SpotlightCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-paper-dim">
            <span className="label-mono">REQUIRED CHAIN</span>
            <Film className="w-4 h-4 text-brass" />
          </div>
          <div className="font-display text-3xl text-paper">
            {summary.total}
          </div>
          <p className="font-mono text-[11px] text-paper-dim">
            Films in dependency sequence
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-paper-dim">
            <span className="label-mono">COMPLETED</span>
            <CheckCircle2
              className={`w-4 h-4 ${
                isAllWatched ? "text-verdigris" : "text-brass"
              }`}
            />
          </div>
          <div
            className={`font-display text-3xl ${
              isAllWatched ? "text-verdigris" : "text-paper"
            }`}
          >
            {summary.watched}{" "}
            <span className="text-base font-normal text-paper-dim">
              / {summary.total}
            </span>
          </div>
          <p className="font-mono text-[11px] text-paper-dim">
            Screenings logged as watched
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-4 space-y-1">
          <div className="flex items-center justify-between text-paper-dim">
            <span className="label-mono">OUTSTANDING TIME</span>
            <Clock
              className={`w-4 h-4 ${
                summary.remainingRuntimeMinutes > 0
                  ? "text-ember"
                  : "text-verdigris"
              }`}
            />
          </div>
          <div
            className={`font-display text-3xl ${
              summary.remainingRuntimeMinutes > 0
                ? "text-ember"
                : "text-verdigris"
            }`}
          >
            {formatRuntime(summary.remainingRuntimeMinutes)}
          </div>
          <p className="font-mono text-[11px] text-paper-dim">
            {summary.unwatched > 0
              ? `${summary.remainingRuntimeMinutes} minutes remaining`
              : "All screenings completed"}
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

