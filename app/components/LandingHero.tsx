import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronUp,
  CircleHelp,
  Lightbulb,
  MessageCircle,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";

const previewPosts = [
  {
    type: "Suggestion",
    title: "Let teams pin the decisions that came out of a thread",
    body: "Great conversations should end with a clear next step everyone can find.",
    votes: 42,
    comments: 9,
    color: "bg-accent",
    icon: Lightbulb,
  },
  {
    type: "Question",
    title: "Which onboarding moment feels the most confusing?",
    body: "Share a screenshot or describe where you paused.",
    votes: 27,
    comments: 18,
    color: "bg-secondary",
    icon: CircleHelp,
  },
];

export function LandingHero() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_70%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_58%)]" />
        <div className="relative mx-auto grid max-w-310 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-secondary" />
              </span>
              The board is live
            </div>
            <h1 className="max-w-[760px] font-display text-[clamp(3rem,8vw,6.7rem)] font-bold leading-[0.9] tracking-[-0.07em] text-foreground">
              Good ideas
              <span className="block text-accent">get a signal.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              One shared place for your community to suggest, question, discuss, and
              decide—without the best thinking getting buried in another group chat.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-[0_10px_28px_color-mix(in_srgb,var(--accent)_26%,transparent)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
              >
                Open the live board
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-bold text-foreground transition hover:border-muted-foreground hover:bg-muted"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["Live updates", "One vote per person", "Threaded feedback"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-secondary" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-10 hidden h-[72%] w-1 rounded-full bg-linear-to-b from-accent via-secondary to-transparent lg:block" />
            <div className="overflow-hidden rounded-[28px] border border-border bg-background shadow-[0_30px_80px_rgba(20,29,34,0.14)]">
              <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:px-5">
                <div>
                  <p className="font-display text-sm font-bold">Product circle</p>
                  <p className="text-xs text-muted-foreground">1,248 people · 84 online</p>
                </div>
                <span className="rounded-full bg-secondary/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Live
                </span>
              </div>

              <div className="space-y-3 p-3 sm:p-4">
                {previewPosts.map((post) => {
                  const Icon = post.icon;
                  return (
                    <article
                      key={post.title}
                      className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 pl-5 transition hover:border-muted-foreground/60 sm:p-5 sm:pl-6"
                    >
                      <span className={`absolute inset-y-0 left-0 w-1 ${post.color}`} />
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <span className={`grid size-7 place-items-center rounded-full ${post.color} text-white`}>
                          <Icon className="size-3.5" aria-hidden="true" />
                        </span>
                        {post.type}
                        <span>·</span>
                        posted 12m ago
                      </div>
                      <h2 className="font-display text-base font-bold leading-snug tracking-[-0.02em] sm:text-lg">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 text-xs font-bold">
                          <ChevronUp className="size-4 text-accent" strokeWidth={3} />
                          {post.votes}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <MessageCircle className="size-4" />
                          {post.comments}
                        </span>
                      </div>
                    </article>
                  );
                })}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-foreground p-4 text-background">
                    <Radio className="mb-5 size-5 text-accent" />
                    <p className="font-display text-2xl font-bold">84</p>
                    <p className="mt-1 text-xs text-background/65">people here now</p>
                  </div>
                  <div className="rounded-2xl bg-secondary p-4 text-secondary-foreground">
                    <Sparkles className="mb-5 size-5" />
                    <p className="font-display text-2xl font-bold">73%</p>
                    <p className="mt-1 text-xs opacity-75">ideas moved forward</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-310 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Built for useful conversation
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.05em] sm:text-5xl">
            Less noise. More movement.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "A shared room",
              text: "Bring suggestions, open questions, and decisions into one feed your whole team can follow.",
            },
            {
              icon: ChevronUp,
              title: "Visible priorities",
              text: "Voting reveals what matters without turning every conversation into another meeting.",
            },
            {
              icon: Radio,
              title: "Live by default",
              text: "New posts, votes, and comments appear in real time, so nobody needs to refresh or chase updates.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-surface p-7 sm:p-9">
              <Icon className="size-6 text-accent" aria-hidden="true" />
              <h3 className="mt-8 font-display text-xl font-bold tracking-[-0.03em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
