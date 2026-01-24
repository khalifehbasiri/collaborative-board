import { query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return {
      userId: identity.subject,
      name: identity.name || identity.nickname || "Anonymous",
      email: identity.email,
    };
  },
});
