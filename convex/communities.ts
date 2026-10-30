import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { communitySlug } from "./lib/validators";
import { getCurrentUserOrNull, requireCurrentUser } from "./lib/users";

export const joined = query({
  args: {}, returns: v.array(communitySlug),
  handler: async (ctx) => {
    const user = await getCurrentUserOrNull(ctx);
    if (!user) return [];
    const rows = await ctx.db.query("memberships").withIndex("by_userId_community", q => q.eq("userId", user._id)).take(4);
    return rows.map(row => row.community);
  },
});

export const setMembership = mutation({
  args: { community: communitySlug, joined: v.boolean() }, returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const existing = await ctx.db.query("memberships").withIndex("by_userId_community", q => q.eq("userId", user._id).eq("community", args.community)).unique();
    if (args.joined && !existing) await ctx.db.insert("memberships", { userId: user._id, community: args.community });
    if (!args.joined && existing) await ctx.db.delete(existing._id);
    return null;
  },
});
