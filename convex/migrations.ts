import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { ranking } from "./lib/validators";

// Optional additions allow a backend-first deploy without invalidating existing data.
export const communityRelease = internalMutation({
  args: { cursor: v.optional(v.string()) }, returns: v.null(),
  handler: async (ctx, args) => {
    const page = await ctx.db.query("posts").paginate({ cursor: args.cursor ?? null, numItems: 50 });
    for (const post of page.page) {
      if (post.community !== undefined && post.searchText !== undefined && post.commentCount !== undefined) continue;
      const author = await ctx.db.get(post.authorId);
      await ctx.db.patch(post._id, {
        community: post.community ?? "general", ...ranking(post.upvotes, post.downvotes, post.createdAt),
        searchText: `${post.title ?? ""} ${post.content} ${author?.name ?? ""}`,
        commentCount: post.commentCount ?? 0,
      });
      await ctx.scheduler.runAfter(0, internal.migrations.countComments, { postId: post._id });
    }
    if (!page.isDone) await ctx.scheduler.runAfter(0, internal.migrations.communityRelease, { cursor: page.continueCursor });
    return null;
  },
});

export const countComments = internalMutation({
  args: { postId: v.id("posts"), cursor: v.optional(v.string()), total: v.optional(v.number()) }, returns: v.null(),
  handler: async (ctx, args) => {
    if (!await ctx.db.get(args.postId)) return null;
    const page = await ctx.db.query("comments").withIndex("by_postId", q => q.eq("postId", args.postId)).paginate({ cursor: args.cursor ?? null, numItems: 100 });
    const total = (args.total ?? 0) + page.page.filter(row => !row.deleted).length;
    if (page.isDone) await ctx.db.patch(args.postId, { commentCount: total });
    else await ctx.scheduler.runAfter(0, internal.migrations.countComments, { postId: args.postId, cursor: page.continueCursor, total });
    return null;
  },
});
