"use client";

import { useConvexAuth, useMutation, usePaginatedQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { ChevronDown, ChevronRight, Reply, Trash2 } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { errorMessage } from "../../lib/errors";

type Comment = FunctionReturnType<typeof api.comments.thread>["page"][number];

function ReplyForm({
  postId,
  parentId,
  onDone,
}: {
  postId: Id<"posts">;
  parentId?: Id<"comments">;
  onDone?: () => void;
}) {
  const { isAuthenticated } = useConvexAuth();
  const create = useMutation(api.comments.create);
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!isAuthenticated)
    return (
      <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        Sign in from the top navigation to reply.
      </p>
    );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim() || pending) return;
    setPending(true);
    setError("");
    try {
      await create({ postId, parentId, content: content.trim() });
      setContent("");
      onDone?.();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="my-3 space-y-2">
      <label className="block">
        <span className="sr-only">
          {parentId ? "Write a reply" : "Add a comment"}
        </span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={500}
          required
          rows={3}
          disabled={pending}
          placeholder={
            parentId ? "Reply to this comment…" : "Add to the conversation…"
          }
          className="w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-accent"
        />
      </label>
      <div className="flex items-center justify-end gap-3">
        <span className="text-[10px] text-muted-foreground">
          {content.length}/500
        </span>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-xs font-bold text-muted-foreground"
          >
            Cancel
          </button>
        )}
        <button
          disabled={pending || !content.trim()}
          className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground disabled:opacity-40"
        >
          {pending ? "Posting…" : "Reply"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}

function CommentNode({ comment }: { comment: Comment }) {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const remove = useMutation(api.comments.deleteComment);
  const [replying, setReplying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function deleteComment() {
    if (!confirm("Delete your comment? Replies from other people will stay."))
      return;
    setPending(true);
    setError("");
    try {
      await remove({ commentId: comment._id });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="min-w-0 border-l-2 border-border pl-3 sm:pl-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold">{comment.authorName}</span>
        <time
          className="text-[10px] text-muted-foreground"
          dateTime={new Date(comment.createdAt).toISOString()}
        >
          {new Date(comment.createdAt).toLocaleDateString()}
        </time>
      </div>
      <p
        className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 ${comment.deleted ? "italic text-muted-foreground" : "text-foreground"}`}
      >
        {comment.content}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
        {(comment.depth ?? 0) < 8 && isAuthenticated && (
          <button
            onClick={() => setReplying(!replying)}
            aria-expanded={replying}
            className="inline-flex items-center gap-1 py-1 hover:text-accent"
          >
            <Reply className="size-3.5" />
            Reply
          </button>
        )}
        {comment.hasReplies && (
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 py-1 hover:text-accent"
          >
            {expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
            {expanded ? "Collapse replies" : "Show replies"}
          </button>
        )}
        {!comment.deleted && user?.id === comment.authorClerkId && (
          <button
            onClick={deleteComment}
            disabled={pending}
            className="inline-flex items-center gap-1 py-1 hover:text-red-500 disabled:opacity-50"
            aria-label="Delete comment"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
      {replying && (
        <ReplyForm
          postId={comment.postId}
          parentId={comment._id}
          onDone={() => {
            setReplying(false);
            setExpanded(true);
          }}
        />
      )}
      {expanded && comment.hasReplies && (
        <div className="mt-4">
          <Thread postId={comment.postId} parentId={comment._id} />
        </div>
      )}
    </article>
  );
}

function Thread({
  postId,
  parentId,
}: {
  postId: Id<"posts">;
  parentId?: Id<"comments">;
}) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.comments.thread,
    { postId, parentId },
    { initialNumItems: 10 },
  );
  return (
    <div className="space-y-5">
      {status === "LoadingFirstPage" ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading replies…
        </p>
      ) : results.length === 0 && !parentId ? (
        <p className="py-5 text-center text-sm text-muted-foreground">
          No replies yet. Add the first useful thought.
        </p>
      ) : (
        results.map((comment) => (
          <CommentNode key={comment._id} comment={comment} />
        ))
      )}
      {(status === "CanLoadMore" || status === "LoadingMore") && (
        <button
          onClick={() => loadMore(10)}
          disabled={status === "LoadingMore"}
          className="rounded-full border border-border px-3 py-2 text-xs font-bold disabled:opacity-50"
        >
          {status === "LoadingMore" ? "Loading…" : "More replies"}
        </button>
      )}
    </div>
  );
}

export function CommentList({ postId }: { postId: Id<"posts"> }) {
  return (
    <div className="space-y-6">
      <ReplyForm postId={postId} />
      <Thread postId={postId} />
    </div>
  );
}
