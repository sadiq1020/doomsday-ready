interface ChapterHeaderProps {
  chapter: string;
  label: string;
  title: string;
  description?: string;
}

export function ChapterHeader({
  chapter,
  label,
  title,
  description,
}: ChapterHeaderProps) {
  return (
    <div className="relative mb-10 pb-6 border-b border-hairline">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-mono text-3xl sm:text-4xl font-light text-brass/80 tracking-tighter">
          {chapter}
        </span>
        <span className="label-mono font-semibold text-brass">
          {label}
        </span>
      </div>
      <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-paper">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl font-body text-sm sm:text-base text-paper-dim leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

