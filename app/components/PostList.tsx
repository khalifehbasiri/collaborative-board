"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VoteButton } from "./VoteButton";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";

export function PostList() {
  const posts = useQuery(api.posts.list);
  const deletePost = useMutation(api.posts.deletePost);
  const { user } = useUser();

  const handleDelete = async (postId: Id<"posts">) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "suggestion":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "question":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "topic":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-600 dark:text-zinc-400">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">
          No posts yet. Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isOwner = user?.id === post.authorId;
        return (
          <article
            key={post._id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getTypeColor(
                    post.type
                  )}`}
                >
                  {post.type}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  by {post.authorName}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleDelete(post._id)}
                  className="rounded-lg px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 dark:active:bg-red-900/50"
                  aria-label="Delete post"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="mb-4 text-zinc-900 dark:text-zinc-50">{post.content}</p>

            <div className="flex items-center justify-between">
              <VoteButton postId={post._id} voteCount={post.voteCount} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
