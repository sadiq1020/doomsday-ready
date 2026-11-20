import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

const CHAPTERS = [
  {
    number: "01",
    label: "INTELLIGENCE ARCHIVE",
    title: "The Archive",
    description:
      "Inspect cataloged Marvel features, manage watched checkpoints, verify runtimes, and edit prerequisite dependencies with automated cycle detection.",
    href: "/movies",
    badge: "8 FILMS CATALOGED",
  },
  {
    number: "02",
    label: "TOPOLOGICAL SEQUENCE",
    title: "The Rewatch Path",
    description:
      "Target any premiere objective to resolve its complete prerequisite chain in strict DFS post-order dependency sequence, complete with runtime countdown telemetry.",
    href: "/plan",
    badge: "DFS POST-ORDER",
  },
  {
    number: "03",
    label: "VENUE OPTIMIZATION",
    title: "Opening Night",
    description:
      "Calculate optimal seat bundle allocations across premier cinema complexes using dynamic programming to seat your squad with zero ticket waste.",
    href: "/booking",
    badge: "DYNAMIC PROGRAMMING",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* Editorial Asymmetric Headline Section */}
      <section className="space-y-6 max-w-4xl text-left">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-widest uppercase bg-brass/10 text-brass-bright border border-brass/30 rounded-[2px]">
            <ShieldAlert className="w-3.5 h-3.5 text-brass" />
            DIRECTIVE // MCU-2026
          </span>
          <span className="text-xs font-mono text-paper-dim tracking-wider">
            CLASSIFIED BRIEFING DOSSIER
          </span>
        </div>

        {/* Large Asymmetric Fraunces Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-paper tracking-tight leading-[1.08]">
          Be ready before <br className="hidden sm:inline" />
          <span className="italic text-brass-bright">Doomsday.</span>
        </h1>

        <p className="font-body text-base sm:text-xl text-paper-dim leading-relaxed max-w-2xl pt-2">
          The threat approaches. Access classified mission files to audit prerequisite
          timelines, generate topological rewatch sequences without narrative gaps,
          and secure exact squad seat allocations for opening night.
        </p>
      </section>

      {/* Three Chapter Links as Big Numbered Rows */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-brass/20 pb-3">
          <span className="label-mono">MISSION CHAPTERS</span>
          <span className="text-[11px] font-mono text-paper-dim">
            SELECT A FILE TO ACCESS
          </span>
        </div>

        <div className="divide-y divide-brass/15 border-y border-brass/20">
          {CHAPTERS.map((chapter) => (
            <Link
              key={chapter.number}
              href={chapter.href}
              className="group block py-8 sm:py-10 px-3 sm:px-6 transition-all duration-300 hover:bg-ink-2/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass rounded-[2px]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left side: Big Number and Chapter Title */}
                <div className="flex items-start sm:items-center gap-6 sm:gap-8">
                  <span className="font-display text-4xl sm:text-6xl text-brass/40 group-hover:text-brass transition-colors leading-none shrink-0 pt-1 sm:pt-0">
                    {chapter.number}
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="label-mono text-brass-bright/80 group-hover:text-brass-bright">
                        {chapter.label}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-paper-dim bg-ink px-2 py-0.5 rounded-[2px] border border-brass/15">
                        {chapter.badge}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-4xl text-paper group-hover:text-brass-bright transition-colors">
                      {chapter.title}
                    </h2>

                    <p className="font-body text-xs sm:text-sm text-paper-dim leading-relaxed max-w-xl">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Sliding Arrow on Hover */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0 pt-2 md:pt-0">
                  <span className="text-xs font-mono uppercase tracking-widest text-paper-dim group-hover:text-brass transition-colors hidden sm:inline">
                    Open dossier
                  </span>
                  <div className="w-10 h-10 rounded-[2px] bg-ink border border-brass/25 group-hover:border-brass group-hover:bg-brass/15 flex items-center justify-center transition-all duration-300 text-brass">
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Classified Intelligence Footnote */}
      <section className="p-6 bg-ink-2/50 border border-brass/20 rounded-[3px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-paper-dim">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brass shrink-0" />
          <span>ALGORITHMIC INTEGRITY GUARANTEED: ZERO CYCLES, ZERO SEAT DEFICIT</span>
        </div>
        <span className="text-paper-dim/60">
          ALL SYSTEMS VERIFIED FOR PRODUCTION
        </span>
      </section>
    </div>
  );
}
