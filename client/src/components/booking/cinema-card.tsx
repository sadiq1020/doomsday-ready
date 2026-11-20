"use client";

import { Building2, Check, Ticket } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { Cinema } from "@/types/api";

interface CinemaCardProps {
  cinema: Cinema;
  isSelected: boolean;
  onSelect: (cinema: Cinema) => void;
}

export function CinemaCard({ cinema, isSelected, onSelect }: CinemaCardProps) {
  return (
    <SpotlightCard
      onClick={() => onSelect(cinema)}
      withTicks={isSelected}
      className={`p-5 transition-all duration-300 cursor-pointer text-left select-none ${
        isSelected
          ? "border-brass bg-ink-3 shadow-[0_0_25px_rgba(201,162,75,0.2)] ring-1 ring-brass/60"
          : "border-brass/20 bg-ink-2 hover:border-brass/50 hover:bg-ink-3/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-paper-dim">
            <Building2 className="w-3.5 h-3.5 text-brass" />
            <span className="label-mono">HOST VENUE</span>
          </div>
          <h3 className="font-display text-xl text-paper">{cinema.name}</h3>
        </div>

        <div
          className={`w-5 h-5 rounded-[2px] border flex items-center justify-center transition-colors shrink-0 ${
            isSelected
              ? "bg-brass border-brass text-ink"
              : "border-brass/30 bg-ink"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Ticket-shaped bundle size chips */}
      <div className="mt-4 pt-3 border-t border-brass/15 space-y-2">
        <span className="text-[10px] font-mono text-paper-dim uppercase tracking-wider block">
          OFFERED BUNDLE SIZES:
        </span>
        <div className="flex flex-wrap gap-2">
          {cinema.bundleSizes.map((size) => (
            <span
              key={size}
              className={`relative inline-flex items-center gap-1 px-3 py-1 text-xs font-mono rounded-[2px] border transition-colors ${
                isSelected
                  ? "bg-brass/20 text-brass-bright border-brass/50"
                  : "bg-ink text-paper-dim border-brass/20"
              }`}
            >
              {/* Notched ticket left & right cutouts */}
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-ink-2 border-r border-brass/30" />
              <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-ink-2 border-l border-brass/30" />
              <Ticket className="w-3 h-3 text-brass/70 shrink-0" />
              <span>
                {size} {size === 1 ? "seat" : "seats"}
              </span>
            </span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
