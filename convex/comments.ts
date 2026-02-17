import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "./lib/users";

// Get all comments for a post
export const list = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          authorName: author?.name ?? "Unknown",
          authorClerkId: author?.clerkId ?? null,
        };
      })
    );
  },
});

// Create a new comment
export const create = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireCurrentUser(ctx);

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: currentUser._id,
      content: args.content,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireCurrentUser(ctx);

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== currentUser._id) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
  },
});
