"use client";

import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import {
  communities,
  findCommunity,
  type CommunitySlug,
} from "../../lib/communities";
import { errorMessage } from "../../lib/errors";

export function CommunityDirectory() {
  const params = useSearchParams();
  const community = findCommunity(params.get("community"));
  const { isAuthenticated } = useConvexAuth();
  const joined = useQuery(api.communities.joined);
  const setMembership = useMutation(api.communities.setMembership);
  const [pending, setPending] = useState<CommunitySlug | null>(null);
  const [error, setError] = useState("");
  const isJoined = community ? joined?.includes(community.slug) : false;

  async function toggle() {
    if (!community) return;
    setPending(community.slug);
    setError("");
    try {
      await setMembership({ community: community.slug, joined: !isJoined });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-2 bg-accent" />
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
              Find your people
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
              {community
                ? `c/${community.slug}`
                : "Your community, in conversation."}
            </h1>
          </div>
          {community && (
            <button
              onClick={toggle}
              disabled={
                !isAuthenticated || pending !== null || joined === undefined
              }
              title={isAuthenticated ? "Manage membership" : "Sign in to join"}
              aria-pressed={!!isJoined}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-50"
            >
              {pending ? "Saving…" : isJoined ? "Joined · Leave" : "Join"}
            </button>
          )}
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {community?.description ??
            "Discover ideas worth discussing. Explore a community, ask a question, or share what you’re building."}
        </p>
        <nav
          aria-label="Explore communities"
          className="mt-4 flex flex-wrap gap-2"
        >
          <Link
            href="/dashboard#feed"
            aria-current={!community ? "page" : undefined}
            className={`rounded-full border px-3 py-2 text-xs font-bold ${!community ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`}
          >
            All communities
          </Link>
          {communities.map((item) => (
            <Link
              key={item.slug}
              href={`/dashboard?community=${item.slug}#feed`}
              aria-current={community?.slug === item.slug ? "page" : undefined}
              className={`rounded-full border px-3 py-2 text-xs font-bold ${community?.slug === item.slug ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-muted"}`}
            >
              c/{item.slug}
              {joined?.includes(item.slug) ? " ✓" : ""}
            </Link>
          ))}
        </nav>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
