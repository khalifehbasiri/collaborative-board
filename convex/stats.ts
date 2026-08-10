import { query } from "./_generated/server";

/**
 * Public, read-only totals used by the landing page and dashboard.
 * Convex keeps subscribed clients in sync whenever the underlying data changes.
 */
export const community = query({
  args: {},
  handler: async (ctx) => {
    const [users, posts, votes, comments] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("posts").collect(),
      ctx.db.query("votes").collect(),
      ctx.db.query("comments").collect(),
    ]);

    return {
      members: users.length,
      ideas: posts.length,
      votes: votes.length,
      comments: comments.length,
    };
  },
});
