"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Trash2, Send } from "lucide-react";

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
      await createComment({ postId, content: newComment });
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
    return <div className="text-center py-4 text-gray-500">Loading comments...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-3 rounded-lg group">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-gray-900">{comment.authorName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {user?.id === comment.authorClerkId && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="absolute bottom-3 right-3 text-blue-500 disabled:text-gray-300 hover:text-blue-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="text-center py-2 text-sm text-gray-500 bg-gray-50 rounded-lg">
          Please sign in to comment.
        </div>
      )}
    </div>
  );
}
