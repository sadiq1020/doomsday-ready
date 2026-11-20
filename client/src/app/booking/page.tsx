"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Building2 } from "lucide-react";
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
  const [debouncedGroupSize, setDebouncedGroupSize] = useState<number>(7);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auto-select first cinema once loaded if none is active
  useEffect(() => {
    if (!selectedCinemaId && cinemas.length > 0) {
      setSelectedCinemaId(cinemas[0].id);
    }
  }, [cinemas, selectedCinemaId]);

  const selectedCinema = cinemas.find((c) => c.id === selectedCinemaId) ?? null;

  const handleDebouncedHeadcountChange = useCallback((value: number) => {
    setDebouncedGroupSize(value);
  }, []);

  const {
    data: quote,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useBookingQuote(selectedCinemaId, debouncedGroupSize);

  return (
    <div className="space-y-10">
      <ChapterHeader
        chapter="03"
        label="Opening Night"
        title="Opening Night"
        description="Calculate optimal seat bundle allocations across partner cinemas to seat your squad with zero ticket waste and minimal passes."
      />

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brass/15 pb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brass" />
          <span className="label-mono">
            {isLoadingCinemas
              ? "SEARCHING CINEMA DIRECTORY..."
              : `${cinemas.length} REGISTERED HOST CINEMAS`}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-brass" />
          <span>Add Cinema</span>
        </Button>
      </div>

      {/* Step A: Pick a Cinema */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="label-mono">STEP A: PICK A CINEMA</span>
          <span className="text-[11px] font-mono text-paper-dim">
            SELECT PREFERRED VENUE PARTNER
          </span>
        </div>

        {isLoadingCinemas ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
            <div className="h-36 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
            <div className="h-36 bg-ink-2/60 border border-brass/15 rounded-[3px] animate-pulse" />
          </div>
        ) : cinemas.length === 0 ? (
          <SpotlightCard withTicks className="p-8 text-center space-y-3">
            <p className="font-body text-sm text-paper-dim">
              No cinemas currently registered in the database.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add First Cinema
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

      {/* Step B & Result Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step B Group Size Input */}
        <div className="lg:col-span-5 space-y-3">
          <HeadcountControl
            initialValue={7}
            onDebouncedChange={handleDebouncedHeadcountChange}
            min={1}
            max={10000}
          />
        </div>

        {/* Right: Allocation Result Panel */}
        <div className="lg:col-span-7 space-y-3">
          <span className="label-mono">OPTIMAL BUNDLE RESULT</span>
          <QuoteResult
            quote={quote}
            cinema={selectedCinema}
            isLoading={isLoadingQuote}
            error={quoteError}
            groupSize={debouncedGroupSize}
          />
        </div>
      </div>

      {/* Add Cinema Drawer */}
      <CinemaDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
