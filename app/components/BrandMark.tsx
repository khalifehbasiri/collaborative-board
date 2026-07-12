import Link from "next/link";
import { Radio } from "lucide-react";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label="Collab Board home"
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground shadow-[0_5px_14px_color-mix(in_srgb,var(--accent)_30%,transparent)] transition-transform group-hover:-rotate-6">
        <Radio className="size-5" strokeWidth={2.5} aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface bg-secondary" />
      </span>
      {!compact && (
        <span className="font-display text-[17px] font-bold tracking-[-0.04em] text-foreground">
          collab<span className="text-accent">board</span>
        </span>
      )}
    </Link>
  );
}
