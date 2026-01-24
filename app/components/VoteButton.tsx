"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

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
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        hasVoted
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:active:bg-blue-900/70"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:active:bg-zinc-600"
      } ${
        !isSignedIn
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
      aria-label={hasVoted ? "Remove vote" : "Vote"}
    >
      <svg
        className={`h-5 w-5 transition-transform ${
          hasVoted ? "fill-current" : "stroke-current"
        }`}
        fill={hasVoted ? "currentColor" : "none"}
        strokeWidth={hasVoted ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
      <span className="font-semibold">{voteCount}</span>
    </button>
  );
}
