"use client";

import { Users, Plus, Minus, RotateCcw } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface HeadcountControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PRESETS = [4, 7, 10, 15, 25, 50];

export function HeadcountControl({
  value,
  onChange,
  min = 1,
  max = 10000,
}: HeadcountControlProps) {
  const handleDelta = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) {
      onChange(min);
    } else {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <SpotlightCard withTicks className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brass" />
          <span className="label-mono">SQUAD HEADCOUNT</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(1)}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-paper-dim hover:text-brass transition-colors cursor-pointer"
          title="Reset to 1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Main Counter Display & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ink p-4 rounded-[3px] border border-brass/25">
        <div className="space-y-0.5">
          <label
            htmlFor="headcount-input"
            className="text-[11px] font-mono uppercase text-paper-dim"
          >
            Confirmed Attendees
          </label>
          <div className="flex items-baseline gap-2">
            <input
              id="headcount-input"
              type="number"
              min={min}
              max={max}
              value={value}
              onChange={handleInputChange}
              className="font-display text-4xl sm:text-5xl text-brass bg-transparent w-36 focus:outline-none focus:border-b focus:border-brass"
            />
            <span className="font-mono text-xs text-paper-dim uppercase">
              {value === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleDelta(-5)}
            disabled={value <= min}
            className="px-2.5 py-1.5 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/20 text-xs font-mono text-paper rounded-[2px] transition-colors cursor-pointer"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => handleDelta(-1)}
            disabled={value <= min}
            className="p-1.5 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/20 text-paper rounded-[2px] transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelta(1)}
            disabled={value >= max}
            className="p-1.5 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/20 text-paper rounded-[2px] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelta(5)}
            disabled={value >= max}
            className="px-2.5 py-1.5 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/20 text-xs font-mono text-paper rounded-[2px] transition-colors cursor-pointer"
          >
            +5
          </button>
          <button
            type="button"
            onClick={() => handleDelta(10)}
            disabled={value >= max}
            className="px-2.5 py-1.5 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/20 text-xs font-mono text-paper rounded-[2px] transition-colors cursor-pointer"
          >
            +10
          </button>
        </div>
      </div>

      {/* Preset Quick Picks */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[11px] font-mono text-paper-dim uppercase">
          Quick Preset:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`px-2.5 py-1 text-xs font-mono rounded-[2px] transition-colors cursor-pointer border ${
              value === preset
                ? "bg-brass/20 text-brass-bright border-brass/50"
                : "bg-ink-2 text-paper-dim border-brass/15 hover:text-paper hover:border-brass/35"
            }`}
          >
            {preset} {preset === 1 ? "seat" : "seats"}
          </button>
        ))}
      </div>
    </SpotlightCard>
  );
}

