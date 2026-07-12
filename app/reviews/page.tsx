import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { PublicPageIntro } from "../components/PublicPageIntro";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Community stories",
  description: "How different groups use Collab Board to hear people and move ideas forward.",
};

const stories = [
  {
    quote:
      "Our roadmap meeting starts with evidence now. We can see which ideas have support and read the reasons before anyone enters the room.",
    name: "Maya Chen",
    role: "Product lead, Northline",
    metric: "2.4×",
    metricLabel: "more team participation",
    color: "bg-accent",
  },
  {
    quote:
      "Quiet students started contributing because they had time to think before responding. The class discussion became much more balanced.",
    name: "Jon Bell",
    role: "Design educator",
    metric: "91%",
    metricLabel: "of students contributed",
    color: "bg-secondary",
  },
  {
    quote:
      "We stopped losing volunteer ideas across three chat channels. The board became our shared memory between monthly meetings.",
    name: "Amara Okafor",
    role: "Community organizer",
    metric: "38",
    metricLabel: "ideas acted on",
    color: "bg-foreground",
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <PublicPageIntro
          eyebrow="Community stories"
          title="Different rooms. The same need to be heard."
          description="Small teams and growing communities use the board to give every idea a fair place to land."
        />

        <section className="mx-auto max-w-310 px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {stories.map((story, index) => (
              <article
                key={story.name}
                className="flex min-h-105 flex-col overflow-hidden rounded-3xl border border-border bg-surface"
              >
                <div className={`h-2 ${story.color}`} />
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <Quote className="size-7 text-accent" fill="currentColor" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">STORY 0{index + 1}</span>
                  </div>
                  <blockquote className="mt-8 font-display text-xl font-semibold leading-8 tracking-[-0.025em]">
                    “{story.quote}”
                  </blockquote>
                  <div className="mt-auto border-t border-border pt-7">
                    <p className="text-sm font-bold">{story.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{story.role}</p>
                    <div className="mt-6 flex items-end gap-3">
                      <span className="font-display text-4xl font-bold tracking-[-0.06em] text-accent">
                        {story.metric}
                      </span>
                      <span className="max-w-28 pb-1 text-xs leading-4 text-muted-foreground">
                        {story.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-muted p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-[-0.04em]">
                Make room for the next useful voice.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The live board is open. Read the room or add your own signal.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Visit the board
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
