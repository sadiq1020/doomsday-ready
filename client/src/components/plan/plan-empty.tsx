"use client";

import { Crosshair, Film, AlertTriangle } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";

interface PlanEmptyProps {
  type: "no-target" | "no-prerequisites" | "error";
  targetTitle?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function PlanEmpty({
  type,
  targetTitle,
  errorMessage,
  onRetry,
}: PlanEmptyProps) {
  if (type === "no-target") {
    return (
      <SpotlightCard withTicks className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-[3px] bg-brass/10 border border-brass/25 mx-auto flex items-center justify-center text-brass">
          <Crosshair className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-display text-xl text-paper">
            No Mission Target Specified
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Select a target feature from the registry above to compute its full
            preparatory screening chain in topological dependency order.
          </p>
        </div>
      </SpotlightCard>
    );
  }

  if (type === "no-prerequisites") {
    return (
      <SpotlightCard withTicks className="p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-[3px] bg-verdigris/10 border border-verdigris/25 mx-auto flex items-center justify-center text-verdigris">
          <Film className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-display text-xl text-paper">
            Zero Prerequisites Required
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            {targetTitle ? (
              <>
                <strong className="text-paper">{targetTitle}</strong> stands as an
                introductory feature with no prior prerequisite viewings in the
                registry. You are cleared to watch directly.
              </>
            ) : (
              "This feature has no upstream prerequisite dependencies in the intelligence archive."
            )}
          </p>
        </div>
      </SpotlightCard>
    );
  }

  return (
    <SpotlightCard withTicks className="p-8 sm:p-12 text-center space-y-4 border-ember/30">
      <div className="w-12 h-12 rounded-[3px] bg-ember/10 border border-ember/25 mx-auto flex items-center justify-center text-ember">
        <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="font-display text-xl text-ember">
          Sequence Calculation Failed
        </h3>
        <p className="font-body text-xs text-paper-dim leading-relaxed">
          {errorMessage ?? "An unexpected error occurred while parsing the dependency graph."}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Re-evaluate Sequence
        </Button>
      )}
    </SpotlightCard>
  );
}

