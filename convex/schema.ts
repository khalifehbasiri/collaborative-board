import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { commentFields, communitySlug, postFields } from "./lib/validators";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  posts: defineTable(postFields)
    .index("by_createdAt", ["createdAt"])
    .index("by_authorId", ["authorId"])
    .index("by_score", ["score"])
    .index("by_hotScore", ["hotScore"])
    .index("by_type_createdAt", ["type", "createdAt"])
    .index("by_type_score", ["type", "score"])
    .index("by_type_hotScore", ["type", "hotScore"])
    .index("by_community_createdAt", ["community", "createdAt"])
    .index("by_community_score", ["community", "score"])
    .index("by_community_hotScore", ["community", "hotScore"])
    .index("by_community_type_createdAt", ["community", "type", "createdAt"])
    .index("by_community_type_score", ["community", "type", "score"])
    .index("by_community_type_hotScore", ["community", "type", "hotScore"])
    .index("by_commentCount", ["commentCount"])
    .index("by_community_commentCount", ["community", "commentCount"])
    .searchIndex("search_posts", { searchField: "searchText", filterFields: ["community", "type", "commentCount"] }),

  votes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    type: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),

  comments: defineTable(commentFields)
    .index("by_postId", ["postId"])
    .index("by_authorId", ["authorId"])
    .index("by_postId_parentId", ["postId", "parentId"]),

  savedPosts: defineTable({ postId: v.id("posts"), userId: v.id("users") })
    .index("by_userId", ["userId"])
    .index("by_postId_userId", ["postId", "userId"]),
  memberships: defineTable({ community: communitySlug, userId: v.id("users") })
    .index("by_userId_community", ["userId", "community"]),
});
