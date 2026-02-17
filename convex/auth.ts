import { query } from "./_generated/server";
import { getCurrentUserOrNull } from "./lib/users";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await getCurrentUserOrNull(ctx);

    return {
      userId: user?._id ?? null,
      clerkId: identity.subject,
      name: user?.name ?? (identity.name || identity.nickname || "Anonymous"),
      email: user?.email ?? identity.email,
    };
  },
});
