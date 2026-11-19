"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/movies", label: "01 The Archive", title: "Movies" },
  { href: "/plan", label: "02 The Path", title: "Rewatch Plan" },
  { href: "/booking", label: "03 Opening Night", title: "Booking" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Classified Wordmark */}
        <Link
          href="/"
          className="group flex items-baseline gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-paper group-hover:text-brass-bright transition-colors">
            DOOMSDAY READY
          </span>
          <span className="hidden sm:inline-block font-mono text-[0.625rem] tracking-[0.2em] text-paper-dim/60 uppercase">
            // DOSSIER
          </span>
        </Link>

        {/* Navigation Items with Animated Shared Layout Underline */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors rounded-[2px]",
                  isActive
                    ? "text-brass-bright font-semibold"
                    : "text-paper-dim hover:text-paper"
                )}
              >
                <span className="hidden md:inline text-[0.625rem] opacity-50 mr-1.5">
                  {item.label.split(" ")[0]}
                </span>
                <span>{item.title}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] bg-brass shadow-[0_0_8px_rgba(201,162,75,0.4)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

