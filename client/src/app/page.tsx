import Link from "next/link";
import { ArrowRight, Film, GitFork, Ticket } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Chip } from "@/components/ui/chip";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Dossier Header Briefing */}
      <section className="relative pt-4 sm:pt-8">
        <div className="flex items-center gap-2 mb-4">
          <Chip variant="brass" size="sm">
            CONFIDENTIAL // BRIEFING
          </Chip>
          <span className="font-mono text-xs text-paper-dim/60">
            OP-DOOMSDAY-2026
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-paper max-w-3xl leading-[1.15]">
          Operation Doomsday: Tactical Rewatch & Premiere Logistics
        </h1>

        <p className="mt-6 max-w-2xl font-body text-base sm:text-lg text-paper-dim leading-relaxed">
          The threat approaches. Access classified records to review prerequisite
          timelines, generate topological rewatch schedules, and compute exact opening-night
          bundle allocations.
        </p>
      </section>

      {/* Three Classified Chapters Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Chapter 01 */}
        <Link href="/movies" className="group block focus-visible:outline-none">
          <SpotlightCard
            withTicks
            className="h-full flex flex-col justify-between group-hover:border-brass/50 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-light text-brass/80">
                  01
                </span>
                <Film className="h-4 w-4 text-paper-dim group-hover:text-brass transition-colors" />
              </div>
              <p className="label-mono mb-2">ARCHIVE</p>
              <h2 className="font-display text-xl text-paper group-hover:text-brass-bright transition-colors mb-3">
                The Movie Archive
              </h2>
              <p className="font-body text-xs text-paper-dim leading-relaxed">
                Browse cataloged Marvel features, inspect runtimes, manage watched states,
                and update dependency links without cyclic loops.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-paper-dim group-hover:text-brass">
              <span>ACCESS CHAPTER</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>

        {/* Chapter 02 */}
        <Link href="/plan" className="group block focus-visible:outline-none">
          <SpotlightCard
            withTicks
            className="h-full flex flex-col justify-between group-hover:border-brass/50 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-light text-brass/80">
                  02
                </span>
                <GitFork className="h-4 w-4 text-paper-dim group-hover:text-brass transition-colors" />
              </div>
              <p className="label-mono mb-2">TACTICAL PATH</p>
              <h2 className="font-display text-xl text-paper group-hover:text-brass-bright transition-colors mb-3">
                Rewatch Order
              </h2>
              <p className="font-body text-xs text-paper-dim leading-relaxed">
                Select a target title to resolve complete topological prerequisite chains,
                view watch progression, and tally remaining hours.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-paper-dim group-hover:text-brass">
              <span>RESOLVE PATH</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>

        {/* Chapter 03 */}
        <Link href="/booking" className="group block focus-visible:outline-none">
          <SpotlightCard
            withTicks
            className="h-full flex flex-col justify-between group-hover:border-brass/50 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-light text-brass/80">
                  03
                </span>
                <Ticket className="h-4 w-4 text-paper-dim group-hover:text-brass transition-colors" />
              </div>
              <p className="label-mono mb-2">LOGISTICS</p>
              <h2 className="font-display text-xl text-paper group-hover:text-brass-bright transition-colors mb-3">
                Watch-Party Booking
              </h2>
              <p className="font-body text-xs text-paper-dim leading-relaxed">
                Input squad headcounts to compute exact bundle seat fits with minimal
                ticket count using dynamic programming algorithms.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-paper-dim group-hover:text-brass">
              <span>CALCULATE BUNDLES</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>
      </section>
    </div>
  );
}
