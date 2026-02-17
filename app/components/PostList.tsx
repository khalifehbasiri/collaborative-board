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
  const [filterType, setFilterType] = useState<"suggestion" | "question" | "topic" | undefined>(undefined);
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
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: MessageSquare
        };
      case "question":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          icon: HelpCircle
        };
      case "topic":
        return {
          bg: "bg-purple-50",
          text: "text-purple-600",
          icon: Hash
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: MessageSquare
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Filter:</span>
          </div>
          <select
            value={filterType || "all"}
            onChange={(e) => setFilterType(e.target.value === "all" ? undefined : e.target.value as any)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
          >
            <option value="all">All Posts</option>
            <option value="topic">Topics</option>
            <option value="question">Questions</option>
            <option value="suggestion">Suggestions</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <ArrowUpDown className="w-4 h-4" />
            <span className="font-medium text-sm">Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {posts === undefined ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-400 font-medium">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-[32px] bg-white p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">No posts found</h3>
          <p className="text-gray-500">
            {filterType ? `No ${filterType}s found. Try selecting a different filter.` : "Be the first to share your ideas with the community!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isOwner = user?.id === post.authorId;
            const typeStyle = getTypeStyles(post.type);
            const Icon = typeStyle.icon;

            return (
              <article
                key={post._id}
                className="group rounded-[32px] bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeStyle.bg} ${typeStyle.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">{post.authorName}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className={`text-xs font-medium capitalize ${typeStyle.text}`}>
                          {post.type}
                        </div>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="mb-6 text-lg text-gray-800 leading-relaxed pl-[52px]">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pl-[52px]">
                    <div className="flex items-center gap-4">
                      <VoteButton 
                        postId={post._id} 
                        upvotes={post.upvotes || 0} 
                        downvotes={post.downvotes || 0} 
                      />
                      <button
                        onClick={() => setSelectedPostId(post._id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.commentCount || 0}</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPostId(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-lg h-[600px] flex flex-col shadow-xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg">Comments</h3>
              <button 
                onClick={() => setSelectedPostId(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <CommentList postId={selectedPostId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
