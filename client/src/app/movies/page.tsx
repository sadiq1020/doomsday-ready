import { ChapterHeader } from "@/components/chapter-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";

export default function MoviesPage() {
  return (
    <div>
      <ChapterHeader
        chapter="01"
        label="The Archive"
        title="Classified Cinematic Records"
        description="Cataloged dossier entries for all identified MCU features. Inspect runtimes, manage watched designations, and configure chronological prerequisite links."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">DOSSIER STATUS</span>
            <Chip variant="brass" size="sm">
              ONLINE
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Movie Catalog & Dependency Graph
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            Full movie creation, prerequisite mutation with live cycle protection, and
            status toggling will be connected here in the next step.
          </p>
        </SpotlightCard>

        <SpotlightCard withTicks className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">VALIDATION RULES</span>
            <Chip variant="verdigris" size="sm">
              ACTIVE
            </Chip>
          </div>
          <h3 className="font-display text-lg text-paper">
            Cycle Prevention Protocol
          </h3>
          <p className="font-body text-xs text-paper-dim leading-relaxed">
            All updates enforce strict acyclic dependency checks. Attempting to introduce
            circular references triggers automated 409 rejections.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}

