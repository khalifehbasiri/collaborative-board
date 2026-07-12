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
  const score = upvotes - downvotes;

  return (
    <div className="inline-flex items-center rounded-full bg-muted p-1">
      <button
        onClick={() => handleVote("up")}
        disabled={!isSignedIn}
        className={`grid size-8 place-items-center rounded-full transition-all ${
          userVoteType === "up"
            ? "bg-accent text-white shadow-sm"
            : "text-muted-foreground hover:bg-surface hover:text-accent"
        } ${
          !isSignedIn
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer active:scale-95"
        }`}
        aria-label="Upvote"
        title={isSignedIn ? "Upvote" : "Sign in to vote"}
      >
        <ChevronUp className="size-4" strokeWidth={3} />
      </button>

      <span className="min-w-9 px-1 text-center font-mono text-xs font-bold" aria-label={`${score} net votes`}>
        {score}
      </span>

      <button
        onClick={() => handleVote("down")}
        disabled={!isSignedIn}
        className={`grid size-8 place-items-center rounded-full transition-all ${
          userVoteType === "down"
            ? "bg-secondary text-secondary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-surface hover:text-secondary"
        } ${
          !isSignedIn
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer active:scale-95"
        }`}
        aria-label="Downvote"
        title={isSignedIn ? "Downvote" : "Sign in to vote"}
      >
        <ChevronDown className="size-4" strokeWidth={3} />
      </button>
    </div>
  );
}
