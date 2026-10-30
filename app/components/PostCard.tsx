"use client";

import Link from "next/link";
import { useMutation, useConvexAuth } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useUser } from "@clerk/nextjs";
import { Bookmark, Check, Link2, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { errorMessage } from "../../lib/errors";
import { VoteButton } from "./VoteButton";

type Post = NonNullable<FunctionReturnType<typeof api.posts.get>>;

export function PostCard({
  post,
  detail = false,
}: {
  post: Post;
  detail?: boolean;
}) {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const setSaved = useMutation(api.posts.setSaved);
  const deletePost = useMutation(api.posts.deletePost);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const href = `/posts/${post._id}`;

  async function save() {
    setPending(true);
    setError("");
    try {
      await setSaved({ postId: post._id, saved: !post.saved });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this post and its discussion?")) return;
    setPending(true);
    setError("");
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${href}`);
      setCopied(true);
    } catch {
      setError(
        "Could not copy the link. Open the discussion and copy its address.",
      );
    }
  }

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:border-muted-foreground/60 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <Link
          href={`/dashboard?community=${post.community ?? "general"}`}
          className="font-bold text-accent hover:underline"
        >
          c/{post.community ?? "general"}
        </Link>
        <span>· {post.authorName}</span>
        <time
          dateTime={new Date(post.createdAt).toISOString()}
          title={new Date(post.createdAt).toLocaleString()}
        >
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold capitalize">
          {post.type}
        </span>
      </div>
      {post.title ? (
        <>
          <h2 className="mt-3 break-words font-display text-xl font-bold leading-7 tracking-tight">
            <Link href={href} className="hover:text-accent">
              {post.title}
            </Link>
          </h2>
          <p
            className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground ${detail ? "" : "line-clamp-4"}`}
          >
            {post.content}
          </p>
        </>
      ) : (
        <h2 className="mt-3 whitespace-pre-wrap break-words font-display text-lg font-semibold leading-7">
          <Link href={href} className="hover:text-accent">
            {post.content}
          </Link>
        </h2>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold">
        <VoteButton
          postId={post._id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
        />
        <Link
          href={`${href}#comments`}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-2.5 hover:text-accent"
          aria-label={`Open ${post.commentCount} comments`}
        >
          <MessageCircle className="size-4" />
          {post.commentCount}
        </Link>
        <button
          onClick={save}
          disabled={!isAuthenticated || pending}
          aria-pressed={post.saved}
          title={isAuthenticated ? "Save for later" : "Sign in to save posts"}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 hover:bg-muted disabled:opacity-50"
        >
          <Bookmark
            className={`size-4 ${post.saved ? "fill-accent text-accent" : ""}`}
          />
          {post.saved ? "Saved" : "Save"}
        </button>
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 hover:bg-muted"
        >
          {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
          {copied ? "Copied" : "Share"}
        </button>
        {user?.id === post.authorClerkId && (
          <button
            onClick={remove}
            disabled={pending}
            aria-label="Delete post"
            className="ml-auto rounded-full p-2.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </article>
  );
}
