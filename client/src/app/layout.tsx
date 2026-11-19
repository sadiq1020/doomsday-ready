import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { GrainOverlay } from "@/components/grain-overlay";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doomsday Ready — MCU Rewatch Dossier & Watch Party Booking",
  description:
    "Plan your MCU rewatch sequence for Avengers: Doomsday and compute opening-night seat bundle allocations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper antialiased font-body relative overflow-x-hidden selection:bg-brass selection:text-ink">
        <Providers>
          {/* Film Grain Texture Overlay */}
          <GrainOverlay />

          {/* Ambient Background Atmosphere: Soft Brass Glow & Green Fog */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,162,75,0.08)_0%,transparent_70%)] z-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_100%_100%,rgba(79,181,152,0.05)_0%,transparent_60%)] z-0"
          />

          {/* Header Navigation */}
          <SiteHeader />

          {/* Main Content Area */}
          <main className="flex-1 relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>

          {/* Dossier Footer */}
          <footer className="relative z-10 border-t border-hairline bg-ink py-6 text-center text-xs text-paper-dim">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[0.6875rem]">
              <span className="tracking-widest uppercase">
                DOOMSDAY READY // DIRECTIVE 2026
              </span>
              <span className="text-paper-dim/60 font-body">
                Fan-made project. Not affiliated with Marvel.
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
