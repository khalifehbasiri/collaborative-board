"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { VoteButton } from "./VoteButton";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { Trash2, MessageSquare, HelpCircle, Hash } from "lucide-react";

export function PostList() {
  const posts = useQuery(api.posts.list);
  const deletePost = useMutation(api.posts.deletePost);
  const { user } = useUser();

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

  if (posts === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 font-medium">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[32px] bg-white p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-black mb-2">No posts yet</h3>
        <p className="text-gray-500">
          Be the first to share your ideas with the community!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isOwner = user?.id === post.authorId;
        const typeStyle = getTypeStyles(post.type);
        const Icon = typeStyle.icon;

        return (
          <article
            key={post._id}
            className="group rounded-[32px] bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
          >
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
              <VoteButton postId={post._id} voteCount={post.voteCount} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
