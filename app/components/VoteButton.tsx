"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteButtonProps {
  postId: Id<"posts">;
  upvotes: number;
  downvotes: number;
}

export function VoteButton({ postId, upvotes, downvotes }: VoteButtonProps) {
  const { isSignedIn } = useUser();
  const voteMutation = useMutation(api.posts.vote);
  const voteStatus = useQuery(api.posts.getVoteStatus, { postId });

  const handleVote = async (voteType: "up" | "down") => {
    if (!isSignedIn) return;
    try {
      await voteMutation({ postId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const userVoteType = voteStatus?.voteType;

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => handleVote("up")}
        disabled={!isSignedIn}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
          userVoteType === "up"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-500 hover:bg-gray-200"
        } ${
          !isSignedIn
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer active:scale-95"
        }`}
        aria-label="Upvote"
      >
        <ChevronUp className={`w-4 h-4 ${userVoteType === "up" ? "stroke-[3]" : "stroke-[2.5]"}`} />
        <span>{upvotes}</span>
      </button>

      <div className="w-px h-4 bg-gray-300 mx-1"></div>

      <button
        onClick={() => handleVote("down")}
        disabled={!isSignedIn}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
          userVoteType === "down"
            ? "bg-white text-red-600 shadow-sm"
            : "text-gray-500 hover:bg-gray-200"
        } ${
          !isSignedIn
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer active:scale-95"
        }`}
        aria-label="Downvote"
      >
        <ChevronDown className={`w-4 h-4 ${userVoteType === "down" ? "stroke-[3]" : "stroke-[2.5]"}`} />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
