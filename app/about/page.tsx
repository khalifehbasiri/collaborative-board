import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquareText, Radio, ScanLine, Vote } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { PublicPageIntro } from "../components/PublicPageIntro";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description: "How Collab Board turns community discussion into visible decisions.",
};

const steps = [
  {
    icon: MessageSquareText,
    label: "Share",
    title: "Name the thing clearly",
    text: "Post a suggestion, a question, or a topic. The format gives every conversation a useful starting point.",
  },
  {
    icon: Vote,
    label: "Signal",
    title: "Let the room respond",
    text: "Votes surface shared priorities while comments keep the important context attached to the idea.",
  },
  {
    icon: ScanLine,
    label: "Decide",
    title: "See what deserves action",
    text: "Sort the feed, spot momentum, and leave the conversation with a clearer sense of what should happen next.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <PublicPageIntro
          eyebrow="Why the board exists"
          title="Conversation should leave a trail."
          description="Collab Board is designed for product teams, classrooms, clubs, and communities that want participation without losing clarity."
        />

        <section className="mx-auto max-w-310 px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <Radio className="size-8 text-accent" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.05em] sm:text-4xl">
                A simple loop that keeps ideas moving
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The board does not try to replace every tool. It gives collective thinking
                one dependable home—from the first question to the strongest signal.
              </p>
            </div>

            <ol className="space-y-3">
              {steps.map(({ icon: Icon, label, title, text }, index) => (
                <li
                  key={label}
                  className="grid gap-5 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-[64px_1fr] sm:p-8"
                >
                  <div className="flex items-center gap-3 sm:block">
                    <span className="grid size-12 place-items-center rounded-2xl bg-muted text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground sm:mt-3 sm:block">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
                      {label}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.03em]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex max-w-310 flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between md:py-16">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-accent">
                Ready when your community is
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.05em]">
                Put the next idea on the board.
              </h2>
            </div>
            <Link
              href="/dashboard#create"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Start a post
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
