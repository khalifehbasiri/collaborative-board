"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { MessageSquareText, Send, Trash2 } from "lucide-react";

interface CommentListProps {
  postId: Id<"posts">;
}

export function CommentList({ postId }: CommentListProps) {
  const { user } = useUser();
  const comments = useQuery(api.comments.list, { postId });
  const createComment = useMutation(api.comments.create);
  const deleteComment = useMutation(api.comments.deleteComment);
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({ postId, content: newComment.trim() });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = async (commentId: Id<"comments">) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment({ commentId });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (comments === undefined) {
    return <div className="py-8 text-center text-sm font-semibold text-muted-foreground">Loading comments…</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background px-5 py-10 text-center">
            <MessageSquareText className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-bold text-foreground">No replies yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add the first useful thought.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment._id} className="group rounded-2xl bg-background p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-foreground font-display text-[10px] font-bold text-background">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-foreground">{comment.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <time className="text-[10px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                  {user?.id === comment.authorClerkId && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-60 transition hover:bg-red-500/10 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="pl-9 text-sm leading-6 text-muted-foreground">{comment.content}</p>
            </article>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="relative border-t border-border pt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a useful reply…"
            maxLength={500}
            className="h-24 w-full resize-none rounded-xl border border-border bg-background p-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-full bg-accent text-white transition hover:brightness-105 disabled:bg-muted disabled:text-muted-foreground"
            aria-label="Post comment"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      ) : (
        <div className="rounded-xl bg-muted px-4 py-3 text-center text-xs text-muted-foreground">
          Sign in from the top navigation to reply.
        </div>
      )}
    </div>
  );
}
