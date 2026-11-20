"use client";

import { Building2, Check } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";
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
      className={`p-5 transition-all duration-300 cursor-pointer text-left ${
        isSelected
          ? "border-brass bg-ink-3/80 shadow-[0_0_20px_rgba(201,162,75,0.15)] ring-1 ring-brass/50"
          : "border-brass/20 bg-ink-2 hover:border-brass/40 hover:bg-ink-3/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-paper-dim">
            <Building2 className="w-3.5 h-3.5 text-brass" />
            <span className="label-mono">VENUE PARTNER</span>
          </div>
          <h3 className="font-display text-lg text-paper">{cinema.name}</h3>
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

      <div className="mt-4 pt-3 border-t border-brass/15 space-y-2">
        <span className="text-[11px] font-mono text-paper-dim uppercase tracking-wider block">
          OFFERED BUNDLE TIERS:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {cinema.bundleSizes.map((size) => (
            <Chip
              key={size}
              variant={isSelected ? "brass" : "default"}
              size="sm"
            >
              {size} {size === 1 ? "SEAT" : "SEATS"}
            </Chip>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}

