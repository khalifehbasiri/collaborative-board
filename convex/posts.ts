import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all posts sorted by vote count (descending), then by creation date (descending)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    
    // Sort by voteCount descending, then by createdAt descending
    return posts.sort((a, b) => {
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return b.createdAt - a.createdAt;
    });
  },
});

// Create a new post (requires authentication)
export const create = mutation({
  args: {
    content: v.string(),
    type: v.union(v.literal("suggestion"), v.literal("question"), v.literal("topic")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const postId = await ctx.db.insert("posts", {
      authorId: identity.subject,
      authorName: identity.name || identity.nickname || "Anonymous",
      content: args.content,
      type: args.type,
      createdAt: Date.now(),
      voteCount: 0,
    });

    return postId;
  },
});

// Delete a post (only the author can delete their own post)
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== identity.subject) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete all votes associated with this post
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});

// Vote on a post (toggle vote - if already voted, remove vote; if not, add vote)
export const vote = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Check if user has already voted on this post
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_postId_userId", (q) => 
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (existingVote) {
      // Remove vote
      await ctx.db.delete(existingVote._id);
      await ctx.db.patch(args.postId, {
        voteCount: post.voteCount - 1,
      });
    } else {
      // Add vote
      await ctx.db.insert("votes", {
        postId: args.postId,
        userId: userId,
        createdAt: Date.now(),
      });
      await ctx.db.patch(args.postId, {
        voteCount: post.voteCount + 1,
      });
    }
  },
});

// Check if current user has voted on a post
export const getVoteStatus = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasVoted: false };
    }

    const userId = identity.subject;
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_postId_userId", (q) => 
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    return { hasVoted: !!vote };
  },
});
