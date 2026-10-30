"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { CommentList } from "./CommentList";

export function PostDetail({ postId }: { postId: string }) {
  const post = useQuery(api.posts.get, { postId });
  return (
    <>
      <Link
        href={
          post
            ? `/dashboard?community=${post.community ?? "general"}`
            : "/dashboard"
        }
        className="inline-flex text-sm font-bold text-muted-foreground hover:text-accent"
      >
        ← Back to the community
      </Link>
      {post === undefined ? (
        <p role="status" className="py-12 text-center text-muted-foreground">
          Loading discussion…
        </p>
      ) : post === null ? (
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h1 className="text-xl font-bold">This discussion is unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The post may have been deleted, or the link is incorrect.
          </p>
        </div>
      ) : (
        <>
          <PostCard post={post} detail />
          <section
            id="comments"
            className="scroll-mt-24 rounded-2xl border border-border bg-surface p-4 sm:p-6"
          >
            <h1 className="mb-5 font-display text-xl font-bold">
              Discussion{" "}
              <span className="text-muted-foreground">
                ({post.commentCount})
              </span>
            </h1>
            <CommentList postId={post._id} />
          </section>
        </>
      )}
    </>
  );
}
