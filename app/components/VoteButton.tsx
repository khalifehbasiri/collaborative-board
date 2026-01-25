"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { ChevronUp } from "lucide-react";

interface VoteButtonProps {
  postId: Id<"posts">;
  voteCount: number;
}

export function VoteButton({ postId, voteCount }: VoteButtonProps) {
  const { isSignedIn } = useUser();
  const voteMutation = useMutation(api.posts.vote);
  const voteStatus = useQuery(api.posts.getVoteStatus, { postId });

  const handleVote = async () => {
    if (!isSignedIn) return;
    try {
      await voteMutation({ postId });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const hasVoted = voteStatus?.hasVoted ?? false;

  return (
    <button
      onClick={handleVote}
      disabled={!isSignedIn}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        hasVoted
          ? "bg-black text-white hover:bg-zinc-800"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${
        !isSignedIn
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer active:scale-95"
      }`}
      aria-label={hasVoted ? "Remove vote" : "Vote"}
    >
      <ChevronUp className={`w-4 h-4 ${hasVoted ? "stroke-[3]" : "stroke-[2.5]"}`} />
      <span>{voteCount}</span>
    </button>
  );
}
