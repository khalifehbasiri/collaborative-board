"use client";

import Link from "next/link";
import {
  Bookmark,
  CircleHelp,
  Flame,
  Home,
  Lightbulb,
  MessageSquareText,
  Plus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { communities } from "../../lib/communities";

const feedLinks = [
  { href: "/dashboard", label: "Home feed", icon: Home },
  { href: "/dashboard?sort=popular#feed", label: "Popular now", icon: Flame },
  { href: "/dashboard?view=saved#feed", label: "Saved posts", icon: Bookmark },
  { href: "/dashboard#create", label: "Create a post", icon: Plus },
];

const topicLinks = [
  {
    href: "/dashboard?type=suggestion#feed",
    label: "Suggestions",
    icon: Lightbulb,
    color: "text-accent",
  },
  {
    href: "/dashboard?type=question#feed",
    label: "Questions",
    icon: CircleHelp,
    color: "text-secondary",
  },
  {
    href: "/dashboard?type=topic#feed",
    label: "Open topics",
    icon: MessageSquareText,
    color: "text-violet-500",
  },
];

export function BoardSidebar() {
  const params = useSearchParams();
  const joined = useQuery(api.communities.joined);
  const selected =
    params.get("view") === "saved"
      ? "Saved posts"
      : params.get("sort") === "popular" || params.get("sort") === "top"
        ? "Popular now"
        : !params.get("community") && !params.get("type")
          ? "Home feed"
          : "";
  return (
    <aside className="sticky top-20 hidden self-start lg:block">
      <nav aria-label="Board navigation">
        <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Board
        </p>
        <div className="mt-2 space-y-1">
          {feedLinks.map(({ href, label, icon: Icon }, index) => (
            <Link
              key={label}
              href={href}
              aria-current={selected === label ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-surface ${
                selected === label
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`size-4 ${index === 1 ? "text-accent" : ""}`}
                aria-hidden="true"
              />
              {label}
            </Link>
          ))}
        </div>
        <p className="mt-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Your communities
        </p>
        <div className="mt-2 space-y-1">
          {communities
            .filter((item) => joined?.includes(item.slug))
            .map((item) => (
              <Link
                key={item.slug}
                href={`/dashboard?community=${item.slug}#feed`}
                aria-current={
                  params.get("community") === item.slug ? "page" : undefined
                }
                className="flex rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-accent"
              >
                c/{item.slug}
              </Link>
            ))}
          {!joined?.length && (
            <p className="px-3 py-2 text-xs leading-5 text-muted-foreground">
              Join a community to keep it here.
            </p>
          )}
        </div>

        <p className="mt-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Conversation types
        </p>
        <div className="mt-2 space-y-1">
          {topicLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground"
            >
              <Icon className={`size-4 ${color}`} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
