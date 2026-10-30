import { query, mutation, internalMutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { paginationOptsValidator, paginationResultValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUserOrNull, requireCurrentUser } from "./lib/users";
import { communitySlug, postType, publicPost, ranking, text } from "./lib/validators";

async function enrich(ctx: QueryCtx, post: Doc<"posts">, user: Doc<"users"> | null) {
  const [author, saved] = await Promise.all([
    ctx.db.get(post.authorId),
    user ? ctx.db.query("savedPosts").withIndex("by_postId_userId", q => q.eq("postId", post._id).eq("userId", user._id)).unique() : null,
  ]);
  return { ...post, authorName: author?.name ?? "Unknown", authorClerkId: author?.clerkId ?? null, commentCount: post.commentCount ?? 0, saved: !!saved };
}

// Kept compatible with the previous frontend during the backend-first rollout.
export const list = query({
  args: { type: v.optional(postType), sortBy: v.optional(v.union(v.literal("newest"), v.literal("oldest"))) },
  returns: v.array(publicPost),
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    const query = args.type
      ? ctx.db.query("posts").withIndex("by_type_createdAt", q => q.eq("type", args.type!))
      : ctx.db.query("posts").withIndex("by_createdAt");
    const posts = await query.order(args.sortBy === "oldest" ? "asc" : "desc").take(100);
    return Promise.all(posts.map(post => enrich(ctx, post, user)));
  },
});

export const feed = query({
  args: {
    paginationOpts: paginationOptsValidator, community: v.optional(communitySlug), type: v.optional(postType),
    sort: v.union(v.literal("newest"), v.literal("oldest"), v.literal("hot"), v.literal("top")),
    search: v.optional(v.string()), unanswered: v.optional(v.boolean()),
  },
  returns: paginationResultValidator(publicPost),
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    const search = (args.search ?? "").trim();
    if (search.length > 200) throw new ConvexError("Search must be 200 characters or fewer.");
    const table = ctx.db.query("posts");
    let page;
    if (search) {
      page = await table.withSearchIndex("search_posts", q => {
        let result = q.search("searchText", search);
        if (args.community) result = result.eq("community", args.community);
        if (args.type) result = result.eq("type", args.type);
        if (args.unanswered) result = result.eq("commentCount", 0);
        return result;
      }).paginate(args.paginationOpts);
    } else if (args.unanswered) {
      const query = args.community
        ? table.withIndex("by_community_commentCount", q => q.eq("community", args.community!).eq("commentCount", 0))
        : table.withIndex("by_commentCount", q => q.eq("commentCount", 0));
      page = await query.order("desc").paginate(args.paginationOpts);
    } else {
      const column = args.sort === "top" ? "score" : args.sort === "hot" ? "hotScore" : "createdAt";
      const query = args.community && args.type
        ? table.withIndex(`by_community_type_${column}`, q => q.eq("community", args.community!).eq("type", args.type!))
        : args.community
          ? table.withIndex(`by_community_${column}`, q => q.eq("community", args.community!))
          : args.type
            ? table.withIndex(`by_type_${column}`, q => q.eq("type", args.type!))
            : table.withIndex(`by_${column}`);
      page = await query.order(args.sort === "oldest" ? "asc" : "desc").paginate(args.paginationOpts);
    }
    return { ...page, page: await Promise.all(page.page.map(post => enrich(ctx, post, user))) };
  },
});

export const get = query({
  args: { postId: v.string() }, returns: v.union(publicPost, v.null()),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("posts", args.postId);
    const post = id ? await ctx.db.get(id) : null;
    return post ? enrich(ctx, post, await getCurrentUserOrNull(ctx)) : null;
  },
});

export const create = mutation({
  args: { content: v.string(), type: postType, title: v.optional(v.string()), community: v.optional(communitySlug) },
  returns: v.id("posts"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const content = text(args.content, "Post", 800);
    const title = args.title === undefined ? undefined : text(args.title, "Title", 160);
    const createdAt = Date.now();
    return ctx.db.insert("posts", {
      content, title, type: args.type, community: args.community ?? "general", authorId: user._id,
      createdAt, upvotes: 0, downvotes: 0, commentCount: 0, ...ranking(0, 0, createdAt),
      searchText: `${title ?? ""} ${content} ${user.name}`,
    });
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") }, returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found.");
    if (post.authorId !== user._id) throw new ConvexError("Only the author can delete this post.");
    await ctx.db.delete(args.postId);
    await ctx.scheduler.runAfter(0, internal.posts.cleanup, args);
    return null;
  },
});

export const cleanup = internalMutation({
  args: { postId: v.id("posts") }, returns: v.null(),
  handler: async (ctx, args) => {
    const [votes, comments, saves] = await Promise.all([
      ctx.db.query("votes").withIndex("by_postId", q => q.eq("postId", args.postId)).take(100),
      ctx.db.query("comments").withIndex("by_postId", q => q.eq("postId", args.postId)).take(100),
      ctx.db.query("savedPosts").withIndex("by_postId_userId", q => q.eq("postId", args.postId)).take(100),
    ]);
    for (const row of [...votes, ...comments, ...saves]) await ctx.db.delete(row._id);
    if (votes.length === 100 || comments.length === 100 || saves.length === 100) await ctx.scheduler.runAfter(0, internal.posts.cleanup, args);
    return null;
  },
});

export const vote = mutation({
  args: { postId: v.id("posts"), voteType: v.union(v.literal("up"), v.literal("down")) }, returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found.");
    const existing = await ctx.db.query("votes").withIndex("by_postId_userId", q => q.eq("postId", args.postId).eq("userId", user._id)).unique();
    let upvotes = post.upvotes - (existing?.type === "up" ? 1 : 0);
    let downvotes = post.downvotes - (existing?.type === "down" ? 1 : 0);
    if (existing?.type === args.voteType) await ctx.db.delete(existing._id);
    else {
      if (existing) await ctx.db.patch(existing._id, { type: args.voteType });
      else await ctx.db.insert("votes", { postId: args.postId, userId: user._id, type: args.voteType, createdAt: Date.now() });
      if (args.voteType === "up") upvotes++;
      else downvotes++;
    }
    await ctx.db.patch(args.postId, { upvotes, downvotes, ...ranking(upvotes, downvotes, post.createdAt) });
    return null;
  },
});

export const getVoteStatus = query({
  args: { postId: v.id("posts") },
  returns: v.object({ hasVoted: v.boolean(), voteType: v.union(v.literal("up"), v.literal("down"), v.null()) }),
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    const vote = user ? await ctx.db.query("votes").withIndex("by_postId_userId", q => q.eq("postId", args.postId).eq("userId", user._id)).unique() : null;
    return { hasVoted: !!vote, voteType: vote?.type ?? null };
  },
});

export const saved = query({
  args: { paginationOpts: paginationOptsValidator }, returns: paginationResultValidator(publicPost),
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return { page: [], isDone: true, continueCursor: "" };
    const page = await ctx.db.query("savedPosts").withIndex("by_userId", q => q.eq("userId", user._id)).order("desc").paginate(args.paginationOpts);
    const posts = await Promise.all(page.page.map(async row => {
      const post = await ctx.db.get(row.postId);
      return post ? enrich(ctx, post, user) : null;
    }));
    return { ...page, page: posts.filter(post => post !== null) };
  },
});

export const setSaved = mutation({
  args: { postId: v.id("posts"), saved: v.boolean() }, returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    if (!await ctx.db.get(args.postId)) throw new ConvexError("Post not found.");
    const existing = await ctx.db.query("savedPosts").withIndex("by_postId_userId", q => q.eq("postId", args.postId).eq("userId", user._id)).unique();
    if (args.saved && !existing) await ctx.db.insert("savedPosts", { postId: args.postId, userId: user._id });
    if (!args.saved && existing) await ctx.db.delete(existing._id);
    return null;
  },
});
