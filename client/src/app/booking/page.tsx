"use client";

import { useEffect, useState } from "react";
import { Plus, Building2, Ticket } from "lucide-react";
import { ChapterHeader } from "@/components/chapter-header";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useCinemas, useBookingQuote } from "@/hooks/use-cinemas";
import { CinemaCard } from "@/components/booking/cinema-card";
import { CinemaDrawer } from "@/components/booking/cinema-drawer";
import { HeadcountControl } from "@/components/booking/headcount-control";
import { QuoteResult } from "@/components/booking/quote-result";

export default function BookingPage() {
  const { data: cinemas = [], isLoading: isLoadingCinemas } = useCinemas();
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<number>(7);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auto-select first cinema once cinemas are loaded
  useEffect(() => {
    if (!selectedCinemaId && cinemas.length > 0) {
      setSelectedCinemaId(cinemas[0].id);
    }
  }, [cinemas, selectedCinemaId]);

  const selectedCinema = cinemas.find((c) => c.id === selectedCinemaId) ?? null;

  const {
    data: quote,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useBookingQuote(selectedCinemaId, groupSize);

  return (
    <div className="space-y-10">
      <ChapterHeader
        chapter="03"
        label="Opening Night"
        title="Watch-Party Seat Allocation"
        description="Compute optimal opening-night seat bundles across partner cinemas using dynamic programming. Ensures exact squad seating with zero ticket waste and minimal total bundles."
      />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brass/15 pb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brass" />
          <span className="label-mono">
            {isLoadingCinemas
              ? "SCANNING VENUES..."
              : `${cinemas.length} REGISTERED VENUE PARTNERS`}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-brass" />
          <span>Register Venue</span>
        </Button>
      </div>

      {/* Venue Selection Grid */}
      <div className="space-y-3">
        <span className="label-mono">STEP 01: SELECT HOST CINEMA</span>

        {isLoadingCinemas ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
            <div className="h-32 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
          </div>
        ) : cinemas.length === 0 ? (
          <SpotlightCard withTicks className="p-8 text-center space-y-3">
            <p className="font-body text-sm text-paper-dim">
              No cinema partners currently registered in the database.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
            >
              Register First Cinema
            </Button>
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cinemas.map((cinema) => (
              <CinemaCard
                key={cinema.id}
                cinema={cinema}
                isSelected={cinema.id === selectedCinemaId}
                onSelect={(c) => setSelectedCinemaId(c.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Headcount Control & Quote Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Headcount selector */}
        <div className="lg:col-span-5 space-y-3">
          <span className="label-mono">STEP 02: SPECIFY SQUAD HEADCOUNT</span>
          <HeadcountControl
            value={groupSize}
            onChange={(val) => setGroupSize(val)}
            min={1}
            max={10000}
          />
        </div>

        {/* Right Column: Allocation Output */}
        <div className="lg:col-span-7 space-y-3">
          <span className="label-mono">
            STEP 03: DYNAMIC PROGRAMMING ALLOCATION
          </span>
          <QuoteResult
            quote={quote}
            isLoading={isLoadingQuote}
            error={quoteError}
            venueName={selectedCinema?.name}
            groupSize={groupSize}
          />
        </div>
      </div>

      {/* Register Cinema Drawer */}
      <CinemaDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
