import type { Metadata } from "next";
import { ArrowDown, Clock, MessageSquareText } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { PublicPageIntro } from "../components/PublicPageIntro";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Practical notes on community feedback, better questions, and shared decisions.",
};

const notes = [
  {
    id: "better-prompts",
    category: "Facilitation",
    date: "July 8, 2026",
    readTime: "4 min",
    title: "Ask for a decision, not general feedback",
    summary:
      "“What do you think?” creates a wide conversation. A useful prompt gives people a boundary, a trade-off, and a clear way to respond.",
    points: [
      "Name the decision the group can influence.",
      "State the constraint people should consider.",
      "Ask for the reason behind every strong preference.",
    ],
  },
  {
    id: "quiet-signals",
    category: "Community",
    date: "June 24, 2026",
    readTime: "5 min",
    title: "Design for the people who do not answer first",
    summary:
      "Fast conversation tends to reward confidence and availability. Asynchronous boards create space for reflection—but only when prompts stay open long enough.",
    points: [
      "Keep important questions visible for a full working cycle.",
      "Summarize what has been heard before closing the thread.",
      "Separate popularity from the quality of an argument.",
    ],
  },
  {
    id: "closing-loop",
    category: "Operations",
    date: "June 10, 2026",
    readTime: "3 min",
    title: "Close the loop where the conversation happened",
    summary:
      "People keep contributing when they can see what their input changed. Return to the original thread with the decision, owner, and next step.",
    points: [
      "Write the decision in one plain sentence.",
      "Credit the context that changed the outcome.",
      "Add a date for the next update.",
    ],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <PublicPageIntro
          eyebrow="Field notes"
          title="Small practices for better group thinking."
          description="Short, practical notes for people who ask questions, collect feedback, and turn community input into action."
        />

        <div className="mx-auto max-w-310 px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                In this edition
              </p>
              <nav className="mt-4 space-y-1" aria-label="Article index">
                {notes.map((note, index) => (
                  <a
                    key={note.id}
                    href={`#${note.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground"
                  >
                    <span>Note 0{index + 1}</span>
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-5">
              {notes.map((note, index) => (
                <article
                  key={note.id}
                  id={note.id}
                  className="scroll-mt-24 rounded-3xl border border-border bg-surface p-6 sm:p-9"
                >
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="text-accent">{note.category}</span>
                    <span>·</span>
                    <time>{note.date}</time>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {note.readTime}
                    </span>
                  </div>
                  <div className="mt-8 grid gap-8 md:grid-cols-[1fr_180px]">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">0{index + 1}</p>
                      <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.045em] sm:text-4xl">
                        {note.title}
                      </h2>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                        {note.summary}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-muted p-5">
                      <MessageSquareText className="size-5 text-secondary" aria-hidden="true" />
                      <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Try this
                      </p>
                      <ul className="mt-3 space-y-3">
                        {note.points.map((point) => (
                          <li key={point} className="text-xs leading-5 text-foreground">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
