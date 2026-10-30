import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { paginationOptsValidator, paginationResultValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "./lib/users";
import { publicComment, text } from "./lib/validators";

async function enrich(ctx: QueryCtx, comment: Doc<"comments">) {
  const [author, reply] = await Promise.all([
    comment.deleted ? null : ctx.db.get(comment.authorId),
    ctx.db.query("comments").withIndex("by_postId_parentId", q => q.eq("postId", comment.postId).eq("parentId", comment._id)).first(),
  ]);
  return { ...comment, content: comment.deleted ? "[deleted]" : comment.content, authorName: comment.deleted ? "[deleted]" : author?.name ?? "Unknown", authorClerkId: author?.clerkId ?? null, hasReplies: !!reply };
}

// Compatibility for clients running the previous release.
export const list = query({
  args: { postId: v.id("posts") }, returns: v.array(publicComment),
  handler: async (ctx, args) => {
    if (!await ctx.db.get(args.postId)) return [];
    const rows = await ctx.db.query("comments").withIndex("by_postId", q => q.eq("postId", args.postId)).order("desc").take(100);
    return Promise.all(rows.map(row => enrich(ctx, row)));
  },
});

export const thread = query({
  args: { postId: v.id("posts"), parentId: v.optional(v.id("comments")), paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(publicComment),
  handler: async (ctx, args) => {
    if (!await ctx.db.get(args.postId)) return { page: [], isDone: true, continueCursor: "" };
    const page = await ctx.db.query("comments").withIndex("by_postId_parentId", q => q.eq("postId", args.postId).eq("parentId", args.parentId)).order("asc").paginate(args.paginationOpts);
    return { ...page, page: await Promise.all(page.page.map(row => enrich(ctx, row))) };
  },
});

export const create = mutation({
  args: { postId: v.id("posts"), content: v.string(), parentId: v.optional(v.id("comments")) }, returns: v.id("comments"),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const content = text(args.content, "Reply", 500);
    const post = await ctx.db.get(args.postId);
    if (!post) throw new ConvexError("Post not found.");
    const parent = args.parentId ? await ctx.db.get(args.parentId) : null;
    if (args.parentId && (!parent || parent.postId !== args.postId)) throw new ConvexError("Reply must belong to this discussion.");
    const depth = parent ? (parent.depth ?? 0) + 1 : 0;
    if (depth > 8) throw new ConvexError("This thread is eight levels deep. Reply to an earlier comment.");
    const id = await ctx.db.insert("comments", { postId: args.postId, parentId: args.parentId, authorId: user._id, content, createdAt: Date.now(), depth });
    await ctx.db.patch(args.postId, { commentCount: (post.commentCount ?? 0) + 1 });
    return id;
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("comments") }, returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new ConvexError("Comment not found.");
    if (comment.authorId !== user._id) throw new ConvexError("Only the author can delete this comment.");
    if (comment.deleted) return null;
    // Keep the parent record so deleting a comment never deletes somebody else's replies.
    await ctx.db.patch(comment._id, { content: "", deleted: true });
    const post = await ctx.db.get(comment.postId);
    if (post) await ctx.db.patch(post._id, { commentCount: Math.max(0, (post.commentCount ?? 0) - 1) });
    return null;
  },
});
