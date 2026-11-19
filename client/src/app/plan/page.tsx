import { ChapterHeader } from "@/components/chapter-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";

export default function PlanPage() {
  return (
    <div>
      <ChapterHeader
        chapter="02"
        label="The Rewatch Path"
        title="Topological Rewatch Order"
        description="Select any target feature to compute its complete prerequisite chain in strict dependency order, accompanied by completion tracking and remaining mission runtime."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">ALGORITHM SPECIFICATION</span>
            <Chip variant="brass" size="sm">
              DFS POST-ORDER
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Strict Dependency Sequencing
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Every feature appears strictly after its required prerequisites. The chosen
            target is omitted from the preparatory list.
          </p>
        </SpotlightCard>

        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">MISSION TELEMETRY</span>
            <Chip variant="ember" size="sm">
              RUNTIME TRACKING
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Watch Progress & Time Remaining
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Live progress tracking calculates the exact watch ratio and tallies the total
            minutes required to complete all outstanding prerequisite viewings.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

