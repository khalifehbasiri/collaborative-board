import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    authorId: v.string(),
    authorName: v.string(),
    content: v.string(),
    type: v.union(v.literal("suggestion"), v.literal("question"), v.literal("topic")),
    createdAt: v.number(),
    upvotes: v.number(),
    downvotes: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_authorId", ["authorId"]),

  votes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    type: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    authorName: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_authorId", ["authorId"]),
});
