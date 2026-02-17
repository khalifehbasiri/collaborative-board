import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all posts sorted by creation date (descending), optionally filtered by type
export const list = query({
  args: {
    type: v.optional(v.union(v.literal("suggestion"), v.literal("question"), v.literal("topic"))),
    sortBy: v.optional(v.union(v.literal("newest"), v.literal("oldest"))),
  },
  handler: async (ctx, args) => {
    // We fetch all posts first because we can't easily sort dynamically in the query
    // while also filtering by type in memory effectively without fetching all.
    // For a small app, this is fine. For scale, we'd need specific indexes.
    let posts = await ctx.db.query("posts").collect();
    
    // Filter by type if provided
    if (args.type) {
      posts = posts.filter((post) => post.type === args.type);
    }
    
    // Sort based on sortBy argument
    if (args.sortBy === "oldest") {
      posts.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      // Default to "newest"
      posts.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Fetch comment count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect();
        
        return {
          ...post,
          commentCount: comments.length,
        };
      })
    );

    return postsWithComments;
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
      upvotes: 0,
      downvotes: 0,
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

    // Delete all comments associated with this post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the post
    await ctx.db.delete(args.postId);
  },
});

// Vote on a post
// Updated to support up/down votes
export const vote = mutation({
  args: {
    postId: v.id("posts"),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

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

    const currentUpvotes = post.upvotes || 0;
    const currentDownvotes = post.downvotes || 0;

    if (existingVote) {
      if (existingVote.type === args.voteType) {
        // Toggle off (remove vote)
        await ctx.db.delete(existingVote._id);
        if (args.voteType === "up") {
          await ctx.db.patch(args.postId, { upvotes: currentUpvotes - 1 });
        } else {
          await ctx.db.patch(args.postId, { downvotes: currentDownvotes - 1 });
        }
      } else {
        // Switch vote (e.g. up -> down)
        await ctx.db.patch(existingVote._id, { type: args.voteType });
        if (args.voteType === "up") {
          await ctx.db.patch(args.postId, {
            upvotes: currentUpvotes + 1,
            downvotes: currentDownvotes - 1,
          });
        } else {
          await ctx.db.patch(args.postId, {
            upvotes: currentUpvotes - 1,
            downvotes: currentDownvotes + 1,
          });
        }
      }
    } else {
      // New vote
      await ctx.db.insert("votes", {
        postId: args.postId,
        userId: userId,
        type: args.voteType,
        createdAt: Date.now(),
      });
      if (args.voteType === "up") {
        await ctx.db.patch(args.postId, { upvotes: currentUpvotes + 1 });
      } else {
        await ctx.db.patch(args.postId, { downvotes: currentDownvotes + 1 });
      }
    }
  },
});

// Check if current user has voted on a post and get vote type
export const getVoteStatus = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasVoted: false, voteType: null };
    }

    const userId = identity.subject;
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_postId_userId", (q) => 
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .first();

    return { 
      hasVoted: !!vote, 
      voteType: vote ? vote.type : null 
    };
  },
});
