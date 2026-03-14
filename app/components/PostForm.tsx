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
      <div className="rounded-[32px] bg-background p-8 text-center shadow-sm border border-border">
        <h3 className="text-xl font-bold mb-2">Join the conversation</h3>
        <p className="text-muted-foreground mb-6">
          Sign in to share your ideas, questions, and topics with the community.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] bg-background p-6 sm:p-8 shadow-sm border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Create a Post
        </h2>
        <div className="relative">
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="appearance-none bg-muted pl-10 pr-8 py-2.5 rounded-full text-sm font-medium text-muted-foreground border border-border focus:ring-2 focus:ring-accent/10 cursor-pointer hover:bg-muted transition-colors"
          >
            <option value="suggestion">Suggestion</option>
            <option value="question">Question</option>
            <option value="topic">Topic</option>
          </select>
          <Type className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          className="w-full rounded-2xl bg-muted p-4 text-foreground placeholder-muted-foreground border border-border focus:ring-2 focus:ring-accent/10 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Update"}
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
