import { ChapterHeader } from "@/components/chapter-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";

export default function BookingPage() {
  return (
    <div>
      <ChapterHeader
        chapter="03"
        label="Opening Night"
        title="Squad Watch-Party Booking"
        description="Calculate optimal seat bundle allocations across premier cinema partners to seat your squad with zero ticket waste."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">OPTIMIZATION ALGORITHM</span>
            <Chip variant="brass" size="sm">
              DYNAMIC PROGRAMMING
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Minimum Bundle Allocation
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Solved using bottom-up minimum coin change dynamic programming to guarantee
            the absolute fewest bundles required to reach the exact headcount.
          </p>
        </SpotlightCard>

        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">VENUE DIRECTORY</span>
            <Chip variant="verdigris" size="sm">
              ACTIVE VENUES
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Partner Cinema Seating
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Select among registered cinema complexes including Starlight Cineplex, Galaxy
            Hall, and Vibranium Screens, each offering distinct opening-night bundle tiers.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

