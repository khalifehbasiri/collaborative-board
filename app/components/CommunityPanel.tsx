"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ArrowRight, ChevronUp, MessageCircle, Radio, ShieldCheck } from "lucide-react";

export function CommunityPanel() {
  const stats = useQuery(api.stats.community);
  const formatMetric = (value: number | undefined) =>
    value === undefined ? "—" : value.toLocaleString("en-US");

  return (
    <aside className="sticky top-20 hidden self-start space-y-4 xl:block">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="h-16 bg-[linear-gradient(120deg,var(--accent),#ff9b55)]" />
        <div className="px-5 pb-5">
          <div className="-mt-6 grid size-12 place-items-center rounded-2xl border-4 border-surface bg-foreground text-background">
            <Radio className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold tracking-[-0.03em]">The community board</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A live room for useful ideas, honest questions, and decisions people can understand.
          </p>
          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
            <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
            Live demo data
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-4" aria-live="polite">
            <div>
              <p className="font-display text-xl font-bold">{formatMetric(stats?.members)}</p>
              <p className="text-[11px] text-muted-foreground">members</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-secondary">{formatMetric(stats?.ideas)}</p>
              <p className="text-[11px] text-muted-foreground">ideas shared</p>
            </div>
          </div>
          <Link
            href="/dashboard#create"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            Add to the board
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-secondary" aria-hidden="true" />
          <h2 className="text-sm font-bold">Room agreements</h2>
        </div>
        <ol className="mt-4 space-y-3 text-xs leading-5 text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-mono text-accent">01</span>
            Critique the idea, never the person.
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent">02</span>
            Add context before adding certainty.
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent">03</span>
            Vote for usefulness, not familiarity.
          </li>
        </ol>
        <Link href="/about" className="mt-4 inline-flex text-xs font-bold text-foreground hover:text-accent">
          Why these rules matter
        </Link>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-foreground p-4 text-background">
          <ChevronUp className="size-4 text-accent" />
          <p className="mt-6 font-display text-xl font-bold" aria-live="polite">
            {formatMetric(stats?.votes)}
          </p>
          <p className="mt-1 text-[10px] text-background/60">votes cast</p>
        </div>
        <div className="rounded-2xl bg-secondary p-4 text-secondary-foreground">
          <MessageCircle className="size-4" />
          <p className="mt-6 font-display text-xl font-bold" aria-live="polite">
            {formatMetric(stats?.comments)}
          </p>
          <p className="mt-1 text-[10px] opacity-65">comments shared</p>
        </div>
      </div>
    </aside>
  );
}
