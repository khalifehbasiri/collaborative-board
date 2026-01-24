import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    authorId: v.string(),
    authorName: v.string(),
    content: v.string(),
    type: v.union(v.literal("suggestion"), v.literal("question"), v.literal("topic")),
    createdAt: v.number(),
    voteCount: v.number(),
  })
    .index("by_voteCount", ["voteCount"])
    .index("by_createdAt", ["createdAt"])
    .index("by_authorId", ["authorId"]),

  votes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),
});
