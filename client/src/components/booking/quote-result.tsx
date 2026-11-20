"use client";

import { AlertTriangle, CheckCircle2, Ticket, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";
import type { BookingQuote } from "@/types/api";

interface QuoteResultProps {
  quote?: BookingQuote;
  isLoading: boolean;
  error: Error | null;
  venueName?: string;
  groupSize: number;
}

export function QuoteResult({
  quote,
  isLoading,
  error,
  venueName,
  groupSize,
}: QuoteResultProps) {
  if (isLoading) {
    return (
      <SpotlightCard withTicks className="p-6 space-y-4 animate-pulse">
        <div className="h-4 w-44 bg-ink-3 rounded" />
        <div className="h-16 w-32 bg-ink-3 rounded" />
        <div className="h-28 bg-ink-3 rounded" />
      </SpotlightCard>
    );
  }

  if (error) {
    return (
      <SpotlightCard withTicks className="p-6 space-y-3 border-ember/40 bg-ember/5">
        <div className="flex items-center gap-2 text-ember">
          <AlertTriangle className="w-5 h-5" />
          <span className="label-mono text-ember">OPTIMIZATION ERROR</span>
        </div>
        <p className="font-body text-sm text-paper">
          {error.message || "Failed to calculate optimal seat allocation."}
        </p>
      </SpotlightCard>
    );
  }

  if (!quote) {
    return null;
  }

  if (!quote.possible) {
    return (
      <SpotlightCard
        withTicks
        className="p-6 sm:p-8 space-y-4 border-ember/40 bg-ember/5 text-left"
      >
        <div className="flex items-center gap-2 text-ember">
          <AlertTriangle className="w-5 h-5 stroke-[2]" />
          <span className="label-mono text-ember">
            SEAT ALLOCATION IMPOSSIBLE
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl text-paper">
            Headcount Cannot Be Partitioned
          </h3>
          <p className="font-body text-sm text-paper-dim leading-relaxed">
            {quote.message ||
              `The squad size of ${groupSize} cannot be exactly fulfilled using the bundle sizes offered at ${
                venueName || "the selected cinema"
              } without leaving empty seats.`}
          </p>
        </div>

        <div className="p-3 bg-ink/70 border border-ember/25 rounded-[2px] font-mono text-xs text-ember">
          <strong>RECOMMENDED ACTION:</strong> Adjust squad headcount (e.g., try
          +1 or -1 attendees) or switch to a cinema partner with 1-seat bundle
          options.
        </div>
      </SpotlightCard>
    );
  }

  // Quote is possible
  const totalSeats = quote.breakdown.reduce(
    (acc, b) => acc + b.size * b.count,
    0
  );

  return (
    <SpotlightCard
      withTicks
      className="p-6 sm:p-8 space-y-6 border-verdigris/35 bg-ink-2"
    >
      {/* Header telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brass/15 pb-4">
        <div>
          <div className="flex items-center gap-2 text-verdigris">
            <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            <span className="label-mono text-verdigris">
              OPTIMAL ALLOCATION CONFIRMED
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-paper mt-1">
            Opening Night Pass Breakdown
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Chip variant="verdigris" size="sm">
            {quote.groupSize} SEATS CONFIRMED
          </Chip>
          <Chip variant="brass" size="sm">
            ZERO TICKET WASTE
          </Chip>
        </div>
      </div>

      {/* Big Number Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-ink rounded-[2px] border border-brass/20 space-y-1">
          <span className="label-mono text-paper-dim">TOTAL BUNDLES REQUIRED</span>
          <div className="font-display text-4xl text-brass flex items-baseline gap-2">
            {quote.totalBundles}
            <span className="font-mono text-xs text-paper-dim uppercase font-normal">
              {quote.totalBundles === 1 ? "Bundle Pass" : "Bundle Passes"}
            </span>
          </div>
          <p className="font-mono text-[11px] text-paper-dim">
            Minimum bundles via dynamic programming
          </p>
        </div>

        <div className="p-4 bg-ink rounded-[2px] border border-brass/20 space-y-1">
          <span className="label-mono text-paper-dim">TOTAL CAPACITY ALLOCATED</span>
          <div className="font-display text-4xl text-verdigris flex items-baseline gap-2">
            {totalSeats}
            <span className="font-mono text-xs text-paper-dim uppercase font-normal">
              Exact Seats
            </span>
          </div>
          <p className="font-mono text-[11px] text-paper-dim">
            100% capacity utilization (0 surplus)
          </p>
        </div>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-3">
        <span className="label-mono">BUNDLE MANIFEST</span>

        <div className="space-y-2">
          {quote.breakdown.map((item) => {
            const seatsInThisTier = item.size * item.count;
            return (
              <div
                key={item.size}
                className="flex items-center justify-between p-3.5 bg-ink/80 border border-brass/20 rounded-[2px] transition-colors hover:border-brass/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-brass/15 border border-brass/30 flex items-center justify-center text-brass font-display text-base">
                    {item.size}
                  </div>
                  <div>
                    <div className="font-body text-sm font-medium text-paper">
                      {item.size}-Seat Bundle
                    </div>
                    <div className="text-[11px] font-mono text-paper-dim">
                      {item.count} &times; {item.size} seats = {seatsInThisTier} seats
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display text-2xl text-paper">
                    &times; {item.count}
                  </span>
                  <div className="text-[10px] font-mono text-brass-bright uppercase">
                    {item.count === 1 ? "Bundle" : "Bundles"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SpotlightCard>
  );
}

