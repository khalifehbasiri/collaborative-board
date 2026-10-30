/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
const page = { numItems: 2, cursor: null };
const post = { title: "A useful idea", content: "Build a shared garden", type: "suggestion" as const, community: "general" as const };

test("authentication and server text validation protect writes", async () => {
  const t = convexTest(schema, modules);
  await expect(t.mutation(api.posts.create, post)).rejects.toThrow("Not authenticated");
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  await expect(alice.mutation(api.posts.create, { ...post, content: "  " })).rejects.toThrow("Post must");
  await expect(alice.mutation(api.posts.create, { ...post, title: "x".repeat(161) })).rejects.toThrow("Title must");
  await expect(alice.mutation(api.posts.create, { ...post, content: "x".repeat(801) })).rejects.toThrow("Post must");
});

test("vote switching and toggling update counts and ranking without duplicate votes", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  const id = await alice.mutation(api.posts.create, post);
  await alice.mutation(api.posts.vote, { postId: id, voteType: "up" });
  expect(await t.query(api.posts.get, { postId: id })).toMatchObject({ upvotes: 1, downvotes: 0, score: 1 });
  await alice.mutation(api.posts.vote, { postId: id, voteType: "down" });
  expect(await t.query(api.posts.get, { postId: id })).toMatchObject({ upvotes: 0, downvotes: 1, score: -1 });
  await alice.mutation(api.posts.vote, { postId: id, voteType: "down" });
  expect(await t.query(api.posts.get, { postId: id })).toMatchObject({ upvotes: 0, downvotes: 0, score: 0 });
  expect(await alice.query(api.posts.getVoteStatus, { postId: id })).toEqual({ hasVoted: false, voteType: null });
});

test("feeds paginate, scope communities and types, search titles, and rank top posts", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  const ids = [];
  for (let i = 0; i < 3; i++) ids.push(await alice.mutation(api.posts.create, { ...post, title: `Garden ${i}` }));
  await alice.mutation(api.posts.create, { ...post, community: "design", title: "Typography" });
  await alice.mutation(api.posts.vote, { postId: ids[0], voteType: "up" });
  const first = await t.query(api.posts.feed, { paginationOpts: page, sort: "top", community: "general", type: "suggestion" });
  expect(first.page).toHaveLength(2);
  expect(first.page[0]._id).toBe(ids[0]);
  expect(first.isDone).toBe(false);
  const next = await t.query(api.posts.feed, { paginationOpts: { ...page, cursor: first.continueCursor }, sort: "top", community: "general", type: "suggestion" });
  expect(next.page).toHaveLength(1);
  expect(new Set([...first.page, ...next.page].map(row => row._id)).size).toBe(3);
  const search = await t.query(api.posts.feed, { paginationOpts: page, sort: "newest", search: "Typography", community: "design" });
  expect(search.page.map(row => row.title)).toEqual(["Typography"]);
  expect((await t.query(api.posts.feed, { paginationOpts: page, sort: "hot", search: "Typography", community: "general" })).page).toEqual([]);
});

test("saved posts are private, idempotent, and removable", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  const bob = t.withIdentity({ subject: "bob", name: "Bob" });
  const id = await alice.mutation(api.posts.create, post);
  await alice.mutation(api.posts.setSaved, { postId: id, saved: true });
  await alice.mutation(api.posts.setSaved, { postId: id, saved: true });
  expect((await alice.query(api.posts.saved, { paginationOpts: page })).page).toHaveLength(1);
  expect((await bob.query(api.posts.saved, { paginationOpts: page })).page).toEqual([]);
  expect((await t.query(api.posts.saved, { paginationOpts: page })).page).toEqual([]);
  await alice.mutation(api.posts.setSaved, { postId: id, saved: false });
  expect((await alice.query(api.posts.saved, { paginationOpts: page })).page).toEqual([]);
});

test("membership belongs to the signed-in user and join/leave are idempotent", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  for (let i = 0; i < 2; i++) await alice.mutation(api.communities.setMembership, { community: "design", joined: true });
  expect(await alice.query(api.communities.joined)).toEqual(["design"]);
  expect(await t.query(api.communities.joined)).toEqual([]);
  await alice.mutation(api.communities.setMembership, { community: "design", joined: false });
  expect(await alice.query(api.communities.joined)).toEqual([]);
});

test("reply threads reject foreign parents and retain replies after author deletion", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  const bob = t.withIdentity({ subject: "bob", name: "Bob" });
  const id = await alice.mutation(api.posts.create, post);
  const other = await alice.mutation(api.posts.create, post);
  const parent = await alice.mutation(api.comments.create, { postId: id, content: "First thought" });
  await expect(bob.mutation(api.comments.create, { postId: other, parentId: parent, content: "Wrong thread" })).rejects.toThrow("this discussion");
  const reply = await bob.mutation(api.comments.create, { postId: id, parentId: parent, content: "A useful reply" });
  await expect(bob.mutation(api.comments.deleteComment, { commentId: parent })).rejects.toThrow("Only the author");
  await alice.mutation(api.comments.deleteComment, { commentId: parent });
  const roots = await t.query(api.comments.thread, { postId: id, paginationOpts: page });
  expect(roots.page[0]).toMatchObject({ content: "[deleted]", authorName: "[deleted]", authorClerkId: null, hasReplies: true });
  const children = await t.query(api.comments.thread, { postId: id, parentId: parent, paginationOpts: page });
  expect(children.page[0]._id).toBe(reply);
  expect(await t.query(api.posts.get, { postId: id })).toMatchObject({ commentCount: 1 });
  await expect(bob.mutation(api.posts.deletePost, { postId: id })).rejects.toThrow("Only the author");
});

test("deleting a post rejects new activity and cleans up associated records", async () => {
  const t = convexTest(schema, modules);
  const alice = t.withIdentity({ subject: "alice", name: "Alice" });
  const id = await alice.mutation(api.posts.create, post);
  await alice.mutation(api.posts.setSaved, { postId: id, saved: true });
  await alice.mutation(api.comments.create, { postId: id, content: "Reply" });
  await alice.mutation(api.posts.vote, { postId: id, voteType: "up" });
  await alice.mutation(api.posts.deletePost, { postId: id });
  expect(await t.query(api.posts.get, { postId: id })).toBeNull();
  await expect(alice.mutation(api.comments.create, { postId: id, content: "Late reply" })).rejects.toThrow("Post not found");
  await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  expect(await t.run(ctx => ctx.db.query("comments").take(1))).toEqual([]);
  expect(await t.run(ctx => ctx.db.query("votes").take(1))).toEqual([]);
  expect((await alice.query(api.posts.saved, { paginationOpts: page })).page).toEqual([]);
});

test("legacy posts migrate without changing content, identity, or votes", async () => {
  const t = convexTest(schema, modules);
  const id = await t.run(async ctx => {
    const user = await ctx.db.insert("users", { clerkId: "legacy", name: "Legacy", createdAt: 1 });
    return ctx.db.insert("posts", { authorId: user, content: "Old idea", createdAt: 1, upvotes: 7, downvotes: 2, type: "topic" });
  });
  await t.mutation(internal.migrations.communityRelease, {});
  await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  await t.mutation(internal.migrations.communityRelease, {});
  await t.finishAllScheduledFunctions(() => vi.runAllTimers());
  expect(await t.query(api.posts.get, { postId: id })).toMatchObject({ _id: id, content: "Old idea", community: "general", upvotes: 7, downvotes: 2, score: 5 });
  expect((await t.query(api.posts.feed, { paginationOpts: page, sort: "top", community: "general" })).page).toHaveLength(1);
  expect(await t.query(api.posts.get, { postId: "invalid-id" })).toBeNull();
});
