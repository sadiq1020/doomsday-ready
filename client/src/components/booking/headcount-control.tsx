"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Minus, AlertCircle } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface HeadcountControlProps {
  initialValue?: number;
  onDebouncedChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PRESETS = [4, 8, 12, 20];

export function HeadcountControl({
  initialValue = 7,
  onDebouncedChange,
  min = 1,
  max = 10000,
}: HeadcountControlProps) {
  const [inputValue, setInputValue] = useState<string>(String(initialValue));
  const [errorLine, setErrorLine] = useState<string | null>(null);

  // Debounce the change by 300ms
  useEffect(() => {
    const parsed = parseInt(inputValue, 10);

    if (isNaN(parsed)) {
      setErrorLine("Please enter a valid headcount integer.");
      return;
    }

    if (parsed < min || parsed > max) {
      setErrorLine(`Headcount must be between ${min} and ${max.toLocaleString()} seats.`);
      return;
    }

    setErrorLine(null);

    const timer = setTimeout(() => {
      onDebouncedChange(parsed);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, min, max, onDebouncedChange]);

  const handleDelta = (delta: number) => {
    const current = parseInt(inputValue, 10);
    const base = isNaN(current) ? min : current;
    const next = Math.min(max, Math.max(min, base + delta));
    setInputValue(String(next));
  };

  const handlePreset = (preset: number) => {
    setInputValue(String(preset));
  };

  const currentNum = parseInt(inputValue, 10);

  return (
    <SpotlightCard withTicks className="p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-brass/15 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brass" />
          <span className="label-mono">STEP B: SQUAD HEADCOUNT</span>
        </div>
        <span className="text-[11px] font-mono text-paper-dim">
          LIMIT: 1 - 10,000 SEATS
        </span>
      </div>

      {/* Big Fraunces Number Input & Controls */}
      <div className="bg-ink p-5 rounded-[3px] border border-brass/25 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-paper-dim tracking-wider block">
              REQUIRED TOTAL ATTENDEES
            </span>
            <div className="flex items-baseline gap-3">
              <input
                type="number"
                min={min}
                max={max}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`font-display text-5xl sm:text-6xl text-brass bg-transparent w-40 sm:w-48 focus:outline-none focus:border-b-2 transition-colors ${
                  errorLine
                    ? "text-ember border-b-2 border-ember"
                    : "focus:border-brass"
                }`}
              />
              <span className="font-mono text-xs text-paper-dim uppercase">
                {currentNum === 1 ? "SEAT NEEDED" : "SEATS NEEDED"}
              </span>
            </div>
          </div>

          {/* +/- Steppers */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => handleDelta(-1)}
              disabled={currentNum <= min}
              className="p-3 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/25 text-paper hover:text-brass rounded-[2px] transition-colors cursor-pointer"
              title="Decrease by 1"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelta(1)}
              disabled={currentNum >= max}
              className="p-3 bg-ink-2 hover:bg-ink-3 disabled:opacity-30 disabled:pointer-events-none border border-brass/25 text-paper hover:text-brass rounded-[2px] transition-colors cursor-pointer"
              title="Increase by 1"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Validation Error Line in Mono */}
        {errorLine && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-ember pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorLine}</span>
          </div>
        )}
      </div>

      {/* Quick Presets: 4, 8, 12, 20 */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[11px] font-mono text-paper-dim uppercase tracking-wider">
          Quick Squad Presets:
        </span>
        {PRESETS.map((preset) => {
          const isSelected = currentNum === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => handlePreset(preset)}
              className={`px-3 py-1.5 text-xs font-mono rounded-[2px] transition-colors cursor-pointer border ${
                isSelected
                  ? "bg-brass/25 text-brass-bright border-brass/60 font-semibold"
                  : "bg-ink-2 text-paper-dim border-brass/20 hover:text-paper hover:border-brass/40"
              }`}
            >
              {preset} guests
            </button>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
