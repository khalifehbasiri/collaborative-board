"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

type PostType = "suggestion" | "question" | "topic";

export function PostForm() {
  const { isSignedIn } = useUser();
  const createPost = useMutation(api.posts.create);
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost({ content: content.trim(), type });
      setContent("");
      setType("suggestion");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Please sign in to create a post
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6"
    >
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Create a Post
      </h2>

      <div className="mb-4">
        <label
          htmlFor="type"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as PostType)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-blue-400"
        >
          <option value="suggestion">Suggestion</option>
          <option value="question">Question</option>
          <option value="topic">Topic</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to share?"
          rows={4}
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={!content.trim() || isSubmitting}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200 sm:w-auto"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
