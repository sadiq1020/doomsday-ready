export function MovieSkeleton() {
  return (
    <div className="rounded-[3px] border border-hairline bg-ink-2 p-6 space-y-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-10 w-24 bg-ink-3 rounded-[2px]" />
        <div className="h-6 w-20 bg-ink-3 rounded-[2px]" />
      </div>

      <div className="space-y-2">
        <div className="h-7 w-3/4 bg-ink-3 rounded-[2px]" />
        <div className="h-4 w-28 bg-ink-3 rounded-[2px]" />
      </div>

      <div className="pt-4 border-t border-hairline/60 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-ink-3 rounded-[2px]" />
          <div className="h-5 w-20 bg-ink-3 rounded-[2px]" />
        </div>
        <div className="h-8 w-28 bg-ink-3 rounded-[2px]" />
      </div>
    </div>
  );
}

export function MovieListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MovieSkeleton key={i} />
      ))}
    </div>
  );
}

