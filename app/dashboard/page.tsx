import type { Metadata } from "next";
import { Navigation } from "../components/Navigation";
import { PostForm } from "../components/PostForm";
import { PostList } from "../components/PostList";
import { BoardSidebar } from "../components/BoardSidebar";
import { CommunityPanel } from "../components/CommunityPanel";
import { CircleHelp, Flame, Lightbulb, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Live board",
  description: "Join the live Collab Board community feed.",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navigation />
      <main className="mx-auto max-w-360 px-3 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 flex items-end justify-between gap-5 lg:hidden">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">
              <span className="size-1.5 rounded-full bg-secondary" />
              Live demo data
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
              Community feed
            </h1>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {[
            { label: "Popular", href: "/dashboard?sort=popular#feed", icon: Flame, color: "text-accent" },
            { label: "Suggestions", href: "/dashboard?type=suggestion#feed", icon: Lightbulb, color: "text-accent" },
            { label: "Questions", href: "/dashboard?type=question#feed", icon: CircleHelp, color: "text-secondary" },
            { label: "Topics", href: "/dashboard?type=topic#feed", icon: MessageSquareText, color: "text-violet-500" },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-bold"
            >
              <Icon className={`size-3.5 ${color}`} />
              {label}
            </Link>
          ))}
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[190px_minmax(0,720px)] xl:grid-cols-[190px_minmax(0,720px)_300px]">
          <BoardSidebar />
          <div className="min-w-0 space-y-5">
            <div id="create" className="scroll-mt-24">
              <PostForm />
            </div>
            <div id="feed" className="scroll-mt-24">
              <Suspense fallback={<div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm font-semibold text-muted-foreground">Loading feed…</div>}>
                <PostList />
              </Suspense>
            </div>
          </div>
          <CommunityPanel />
        </div>
      </main>
    </div>
  );
}
