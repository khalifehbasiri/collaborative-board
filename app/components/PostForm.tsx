"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Send, Type } from "lucide-react";

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
      <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
        <p className="text-gray-500 mb-6">
          Sign in to share your ideas, questions, and topics with the community.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">
          Create a Post
        </h2>
        <div className="relative">
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="appearance-none bg-gray-50 pl-10 pr-8 py-2.5 rounded-full text-sm font-medium text-gray-700 border-none focus:ring-2 focus:ring-black/5 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="suggestion">Suggestion</option>
            <option value="question">Question</option>
            <option value="topic">Topic</option>
          </select>
          <Type className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="mb-6">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share your thoughts..."
          rows={3}
          required
          className="w-full rounded-2xl bg-gray-50 p-4 text-gray-900 placeholder-gray-400 border-none focus:ring-2 focus:ring-black/5 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Update"}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
