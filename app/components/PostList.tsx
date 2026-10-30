"use client";

import { usePaginatedQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Search } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { findCommunity } from "../../lib/communities";
import { PostCard } from "./PostCard";

type Sort = "newest" | "oldest" | "hot" | "top";
type Filter = "all" | "suggestion" | "question" | "topic" | "unanswered";

export function PostList() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const saved = params.get("view") === "saved";
  const requestedSort = params.get("sort");
  const sort: Sort =
    requestedSort === "popular"
      ? "top"
      : ["newest", "oldest", "top", "hot"].includes(requestedSort ?? "")
        ? (requestedSort as Sort)
        : "hot";
  const requestedType = params.get("type");
  const type: Filter = [
    "suggestion",
    "question",
    "topic",
    "unanswered",
  ].includes(requestedType ?? "")
    ? (requestedType as Filter)
    : "all";
  const search = (params.get("q") ?? "").slice(0, 200);
  const community = findCommunity(params.get("community"));
  const feed = usePaginatedQuery(
    api.posts.feed,
    saved
      ? "skip"
      : {
          sort,
          community: community?.slug,
          search,
          type: type === "all" || type === "unanswered" ? undefined : type,
          unanswered: type === "unanswered",
        },
    { initialNumItems: 15 },
  );
  const savedFeed = usePaginatedQuery(api.posts.saved, saved ? {} : "skip", {
    initialNumItems: 15,
  });
  const { results, status, loadMore } = saved ? savedFeed : feed;

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}#feed`, { scroll: false });
  }

  return (
    <div className="space-y-4">
      {saved ? (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-xl font-bold">Saved for later</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your private collection, most recently saved first.
          </p>
          <Link
            href="/dashboard#feed"
            className="mt-3 inline-flex text-xs font-bold text-accent"
          >
            ← All conversations
          </Link>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-3">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              update("q", String(data.get("q") ?? "").trim());
            }}
            className="flex gap-2"
          >
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search posts, titles, or authors</span>
              <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                key={search}
                name="q"
                type="search"
                defaultValue={search}
                maxLength={200}
                placeholder={
                  community
                    ? `Search c/${community.slug}…`
                    : "Search posts, titles, or authors…"
                }
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-accent"
              />
            </label>
            <button className="rounded-xl bg-foreground px-4 text-xs font-bold text-background">
              Search
            </button>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1" role="group" aria-label="Feed order">
              {(
                [
                  { value: "hot", label: "Hot" },
                  { value: "newest", label: "New" },
                  { value: "top", label: "Top" },
                  { value: "oldest", label: "Oldest" },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  onClick={() => update("sort", item.value)}
                  disabled={!!search || type === "unanswered"}
                  aria-pressed={sort === item.value}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition disabled:opacity-40 ${sort === item.value ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Show
              <select
                value={type}
                onChange={(event) => update("type", event.target.value)}
                className="rounded-full border border-border bg-background px-3 py-2 font-bold text-foreground"
                aria-label="Filter posts by type"
              >
                <option value="all">All posts</option>
                <option value="suggestion">Suggestions</option>
                <option value="question">Questions</option>
                <option value="topic">Topics</option>
                <option value="unanswered">Unanswered</option>
              </select>
            </label>
          </div>
          <p className="px-1 text-[11px] text-muted-foreground">
            {search
              ? `Search results for “${search}”, ranked by relevance.`
              : type === "unanswered"
                ? "Posts without replies, newest first."
                : sort === "hot"
                  ? "Hot balances net votes and recency. Top shows the highest net vote scores."
                  : "Live conversations, updated as the community contributes."}
            {search && (
              <button
                onClick={() => update("q", "")}
                className="ml-2 font-bold text-accent"
              >
                Clear search
              </button>
            )}
          </p>
        </div>
      )}

      {saved && !isSignedIn ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Sign in from the top navigation to see your saved posts.
        </p>
      ) : status === "LoadingFirstPage" ? (
        <p
          role="status"
          className="py-12 text-center text-sm text-muted-foreground"
        >
          Loading conversations…
        </p>
      ) : (
        <>
          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <h3 className="font-display text-lg font-bold">
                {saved
                  ? "Keep a good conversation close."
                  : "No conversations in this view yet."}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {saved
                  ? "Use Save on any post to find it here later."
                  : search
                    ? "Try another search or clear your filters."
                    : "Start a conversation above, or explore another community."}
              </p>
            </div>
          )}
          <div className="space-y-3">
            {results.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {(status === "CanLoadMore" || status === "LoadingMore") && (
            <button
              onClick={() => loadMore(15)}
              disabled={status === "LoadingMore"}
              className="w-full rounded-full border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-muted disabled:opacity-50"
            >
              {status === "LoadingMore"
                ? "Loading…"
                : "Load more conversations"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
