"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VoteButton } from "./VoteButton";
import { CommentList } from "./CommentList";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { Trash2, MessageSquare, HelpCircle, Hash, MessageCircle, X, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export function PostList() {
  type PostFilter = "suggestion" | "question" | "topic" | undefined;
  const [filterType, setFilterType] = useState<PostFilter>(undefined);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const posts = useQuery(api.posts.list, { type: filterType, sortBy });
  const deletePost = useMutation(api.posts.deletePost);
  const { user } = useUser();
  const [selectedPostId, setSelectedPostId] = useState<Id<"posts"> | null>(null);

  const handleDelete = async (postId: Id<"posts">) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost({ postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "suggestion":
        return {
          bg: "bg-accent/10",
          text: "text-accent",
          rail: "bg-accent",
          icon: MessageSquare
        };
      case "question":
        return {
          bg: "bg-secondary/10",
          text: "text-secondary",
          rail: "bg-secondary",
          icon: HelpCircle
        };
      case "topic":
        return {
          bg: "bg-violet-500/10",
          text: "text-violet-500",
          rail: "bg-violet-500",
          icon: Hash
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          rail: "bg-muted-foreground",
          icon: MessageSquare
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 px-1 text-muted-foreground sm:flex">
            <Filter className="size-4" />
            <span className="text-xs font-bold">Show</span>
          </div>
          <select
            value={filterType || "all"}
            onChange={(e) => {
              const value = e.target.value;
              setFilterType(value === "all" ? undefined : (value as Exclude<PostFilter, undefined>));
            }}
            className="block w-full rounded-full border border-border bg-muted px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 sm:w-auto"
            aria-label="Filter posts by type"
          >
            <option value="all">All Posts</option>
            <option value="topic">Topics</option>
            <option value="question">Questions</option>
            <option value="suggestion">Suggestions</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 px-1 text-muted-foreground sm:flex">
            <ArrowUpDown className="size-4" />
            <span className="text-xs font-bold">Sort</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="block w-full rounded-full border border-border bg-muted px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 sm:w-auto"
            aria-label="Sort posts"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {posts === undefined ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
          <div className="text-sm font-semibold text-muted-foreground">Listening for posts…</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center sm:p-12">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-muted">
            <MessageSquare className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Nothing in this view yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {filterType ? `No ${filterType}s have been posted. Try another filter.` : "Start the first useful conversation above."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const isOwner = user?.id === post.authorClerkId;
            const typeStyle = getTypeStyles(post.type);
            const Icon = typeStyle.icon;

            return (
              <article
                key={post._id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:border-muted-foreground/60 hover:shadow-md"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${typeStyle.rail}`} aria-hidden="true" />
                <div className="p-4 pl-5 sm:p-6 sm:pl-7">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${typeStyle.bg} ${typeStyle.text}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
                          <span className={`font-bold capitalize ${typeStyle.text}`}>{post.type}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="truncate font-semibold text-foreground">{post.authorName}</span>
                          <span className="text-muted-foreground">·</span>
                          <time className="text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">shared with the community</p>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground opacity-60 transition hover:bg-red-500/10 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
                        aria-label="Delete post"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap font-display text-[17px] font-semibold leading-7 tracking-[-0.02em] text-foreground sm:text-lg">
                    {post.content}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <VoteButton 
                        postId={post._id} 
                        upvotes={post.upvotes || 0} 
                        downvotes={post.downvotes || 0} 
                      />
                      <button
                        onClick={() => setSelectedPostId(post._id)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={`Open ${post.commentCount || 0} comments`}
                      >
                        <MessageCircle className="size-4" />
                        <span className="text-xs font-bold">{post.commentCount || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedPostId && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={() => setSelectedPostId(null)}
          role="presentation"
        >
          <div 
            className="flex h-[86dvh] w-full max-w-xl flex-col rounded-t-3xl border border-border bg-surface shadow-2xl sm:h-[640px] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-title"
          >
            <div className="flex items-center justify-between border-b border-border p-4 sm:px-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                  Conversation
                </p>
                <h3 id="comments-title" className="mt-0.5 font-display text-lg font-bold">Comments</h3>
              </div>
              <button 
                onClick={() => setSelectedPostId(null)}
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close comments"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4 sm:p-5">
              <CommentList postId={selectedPostId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
