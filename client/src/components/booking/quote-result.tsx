"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, CheckCircle2, Ticket, Sparkles } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Counter } from "@/components/ui/counter";
import type { BookingQuote, Cinema } from "@/types/api";

interface QuoteResultProps {
  quote?: BookingQuote;
  cinema?: Cinema | null;
  isLoading: boolean;
  error: Error | null;
  groupSize: number;
}

export function QuoteResult({
  quote,
  cinema,
  isLoading,
  error,
  groupSize,
}: QuoteResultProps) {
  // Compute the formula string: e.g. "20 + 18 + 6 = 44 seats, no empty seat"
  const formulaString = useMemo(() => {
    if (!quote || !quote.possible || quote.breakdown.length === 0) return "";
    const terms = quote.breakdown.map((item) => item.size * item.count);
    return `${terms.join(" + ")} = ${quote.groupSize} seats, no empty seat`;
  }, [quote]);

  if (!cinema) {
    return (
      <SpotlightCard withTicks className="p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-[3px] bg-brass/10 border border-brass/25 mx-auto flex items-center justify-center text-brass">
          <Ticket className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="font-display text-xl text-paper">No Cinema Selected</h3>
        <p className="font-body text-xs text-paper-dim max-w-sm mx-auto">
          Choose a partner cinema from Step A to begin evaluating seat bundle
          combinations for your squad.
        </p>
      </SpotlightCard>
    );
  }

  if (isLoading) {
    return (
      <div
        aria-live="polite"
        className="p-8 bg-ink-2 border border-brass/20 rounded-[3px] space-y-5 animate-pulse"
      >
        <div className="h-4 w-40 bg-ink-3 rounded" />
        <div className="h-16 w-56 bg-ink-3 rounded" />
        <div className="space-y-3 pt-2">
          <div className="h-20 bg-ink-3/80 rounded" />
          <div className="h-20 bg-ink-3/80 rounded" />
        </div>
        <div className="h-4 w-72 bg-ink-3 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        aria-live="polite"
        className="p-6 bg-ember/10 border border-ember/40 rounded-[3px] space-y-3 text-ember"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="label-mono text-ember">OPTIMIZATION ERROR</span>
        </div>
        <p className="font-body text-sm text-paper">{error.message}</p>
      </div>
    );
  }

  if (!quote) return null;

  // When not possible: dramatic empty ticket state with dashed border and faint ember glow
  if (!quote.possible) {
    return (
      <div
        aria-live="polite"
        className="relative p-8 sm:p-10 rounded-[3px] border-2 border-dashed border-ember/50 bg-ember/5 shadow-[0_0_35px_rgba(228,87,46,0.15)] space-y-5 overflow-hidden text-left"
      >
        {/* Decorative Notches */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink border-r-2 border-dashed border-ember/50" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink border-l-2 border-dashed border-ember/50" />

        <div className="flex items-center gap-2 text-ember">
          <AlertTriangle className="w-5 h-5 stroke-[2]" />
          <span className="label-mono text-ember">
            PARTITION IMPOSSIBLE
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl sm:text-3xl text-paper">
            No exact combination for {groupSize} seats
          </h3>
          <p className="font-body text-sm text-paper-dim leading-relaxed max-w-lg">
            {cinema.name} does not offer bundle combinations that can fulfill
            exactly {groupSize} seats without leaving unoccupied surplus tickets.
          </p>
        </div>

        <div className="pt-4 border-t border-ember/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-ember">
          <div>
            OFFERED BUNDLE SIZES: [{cinema.bundleSizes.join(", ")}]
          </div>
          <span className="text-paper-dim">
            Adjust squad headcount or select another venue &rarr;
          </span>
        </div>
      </div>
    );
  }

  // When possible: show huge count-up, perforated ticket stubs, and exact formula line
  return (
    <div
      aria-live="polite"
      className="space-y-6 bg-ink-2 border border-brass/35 p-6 sm:p-8 rounded-[3px] shadow-[0_0_30px_rgba(201,162,75,0.08)]"
    >
      {/* Header Result */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-brass/20 pb-5">
        <div>
          <span className="label-mono text-verdigris flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-4 h-4 text-verdigris" />
            OPTIMAL BUNDLE SOLUTION
          </span>
          <div className="font-display text-4xl sm:text-5xl text-brass flex items-baseline gap-2">
            <Counter value={quote.totalBundles} />
            <span className="font-mono text-base text-paper-dim font-normal uppercase tracking-wider">
              {quote.totalBundles === 1 ? "bundle" : "bundles"}
            </span>
          </div>
        </div>

        <div className="font-mono text-xs text-paper-dim sm:text-right">
          <div>HOST: {cinema.name}</div>
          <div className="text-verdigris font-semibold">
            {quote.groupSize} SEATS CONFIRMED
          </div>
        </div>
      </div>

      {/* Breakdown as Ticket Stubs with Perforated Edges and Notches */}
      <div className="space-y-3">
        <span className="label-mono">TICKET STUB ALLOCATION</span>

        <div className="space-y-3">
          <AnimatePresence>
            {quote.breakdown.map((item, index) => {
              const totalTierSeats = item.size * item.count;
              return (
                <motion.div
                  key={item.size}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="relative flex items-center bg-ink-3/90 border border-brass/30 rounded-[3px] overflow-hidden group hover:border-brass/60 transition-colors shadow-sm"
                >
                  {/* Left Ticket Stub Section (Bundle Multiplier) */}
                  <div className="w-28 sm:w-36 p-4 bg-ink/70 flex flex-col justify-center items-center text-center shrink-0 border-r border-dashed border-brass/30 relative">
                    {/* Top and Bottom Perforated Notches */}
                    <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-ink-2 border-b border-brass/30" />
                    <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-ink-2 border-t border-brass/30" />

                    <span className="font-display text-2xl sm:text-3xl text-brass tracking-tight">
                      {item.size} &times; {item.count}
                    </span>
                    <span className="text-[10px] font-mono text-paper-dim uppercase tracking-wider">
                      {item.count === 1 ? "1 Pass" : `${item.count} Passes`}
                    </span>
                  </div>

                  {/* Right Ticket Stub Details */}
                  <div className="p-4 sm:px-6 flex-1 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="font-display text-lg sm:text-xl text-paper">
                        {item.size}-Seat Admission Tier
                      </div>
                      <div className="text-xs font-mono text-paper-dim">
                        Valid for opening night at {cinema.name}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-display text-xl sm:text-2xl text-verdigris">
                        {totalTierSeats}
                      </div>
                      <div className="text-[10px] font-mono text-paper-dim uppercase tracking-wider">
                        Seats Total
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Exact Mono Breakdown Formula Line */}
      {formulaString && (
        <div className="pt-4 border-t border-brass/15 bg-ink/40 p-3 rounded-[2px] border border-brass/10">
          <p className="font-mono text-xs sm:text-sm text-paper tracking-wider text-center sm:text-left">
            &gt; {formulaString}
          </p>
        </div>
      )}
    </div>
  );
}
