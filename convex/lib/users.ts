import { MutationCtx, QueryCtx } from "../_generated/server";

type AnyCtx = MutationCtx | QueryCtx;

export async function getUserByClerkId(ctx: AnyCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .first();
}

export async function getCurrentUserOrNull(ctx: AnyCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return await getUserByClerkId(ctx, identity.subject);
}

export async function requireCurrentUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const existing = await getUserByClerkId(ctx, identity.subject);
  if (existing) {
    return existing;
  }

  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    name: identity.name || identity.nickname || "Anonymous",
    email: identity.email,
    createdAt: Date.now(),
  });

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}
