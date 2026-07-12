"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { CircleHelp, Lightbulb, MessageSquareText, Send } from "lucide-react";

type PostType = "suggestion" | "question" | "topic";

export function PostForm() {
  const { isSignedIn, user } = useUser();
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
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
          Your voice belongs here
        </p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-[-0.03em]">Join the conversation</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Sign in from the top navigation to share an idea, ask a question, or open a topic for the community.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-border p-4 sm:p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm font-bold text-background">
          {(user?.firstName?.[0] || user?.username?.[0] || "Y").toUpperCase()}
        </span>
        <div>
          <h2 className="font-display text-base font-bold tracking-[-0.02em]">Add to the board</h2>
          <p className="text-xs text-muted-foreground">Give the room something clear to respond to.</p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an idea, ask a focused question, or start a useful discussion..."
          rows={4}
          maxLength={800}
          required
          className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
        />

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <fieldset>
            <legend className="sr-only">Post type</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "suggestion", label: "Suggestion", icon: Lightbulb },
                { value: "question", label: "Question", icon: CircleHelp },
                { value: "topic", label: "Topic", icon: MessageSquareText },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value as PostType)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition ${
                    type === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={type === value}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="font-mono text-[10px] text-muted-foreground">{content.length}/800</span>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSubmitting ? "Posting…" : "Post"}
              <Send className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
