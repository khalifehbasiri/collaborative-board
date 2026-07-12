import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";
import { AppHeader } from "./components/AppHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-3xl place-items-center px-4 py-16 text-center">
        <div>
          <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-muted text-accent">
            <Radio className="size-7" aria-hidden="true" />
          </span>
          <p className="mt-7 font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
            404 · Signal lost
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.06em] sm:text-6xl">
            This thread is not on the board.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
            The page may have moved, or the link may be incomplete. Return to the live feed to keep exploring.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105"
          >
            <ArrowLeft className="size-4" />
            Back to the board
          </Link>
        </div>
      </main>
    </div>
  );
}
