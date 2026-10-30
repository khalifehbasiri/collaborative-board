import { ConvexError, v } from "convex/values";

export const communitySlug = v.union(v.literal("general"), v.literal("building"), v.literal("design"), v.literal("learning"));
export const postType = v.union(v.literal("suggestion"), v.literal("question"), v.literal("topic"));
export const postFields = {
  authorId: v.id("users"), content: v.string(), type: postType,
  createdAt: v.number(), upvotes: v.number(), downvotes: v.number(),
  title: v.optional(v.string()), community: v.optional(communitySlug),
  score: v.optional(v.number()), hotScore: v.optional(v.number()),
  commentCount: v.optional(v.number()), searchText: v.optional(v.string()),
};
export const publicPost = v.object({
  ...postFields, _id: v.id("posts"), _creationTime: v.number(),
  authorName: v.string(), authorClerkId: v.union(v.string(), v.null()),
  commentCount: v.number(), saved: v.boolean(),
});
export const commentFields = {
  postId: v.id("posts"), authorId: v.id("users"), content: v.string(), createdAt: v.number(),
  parentId: v.optional(v.id("comments")), deleted: v.optional(v.boolean()), depth: v.optional(v.number()),
};
export const publicComment = v.object({
  ...commentFields, _id: v.id("comments"), _creationTime: v.number(),
  authorName: v.string(), authorClerkId: v.union(v.string(), v.null()), hasReplies: v.boolean(),
});

export function text(value: string, label: string, max: number) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) throw new ConvexError(`${label} must contain 1–${max} characters.`);
  return trimmed;
}

export function ranking(upvotes: number, downvotes: number, createdAt: number) {
  const score = upvotes - downvotes;
  return { score, hotScore: Math.sign(score) * Math.log10(Math.max(Math.abs(score), 1)) + createdAt / 45_000_000 };
}
