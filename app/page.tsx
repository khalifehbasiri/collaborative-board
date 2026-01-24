"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <main className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Convex Tasks
        </h1>

        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          If this list shows up, Convex is connected correctly.
        </p>

        <div className="mt-6">
          {!tasks && (
            <div className="text-zinc-600 dark:text-zinc-400">Loading…</div>
          )}

          {tasks?.length === 0 && (
            <div className="text-zinc-600 dark:text-zinc-400">
              No tasks yet. Import sample data or add a mutation.
            </div>
          )}

          <ul className="mt-2 space-y-3">
            {tasks?.map((t) => (
              <li
                key={t._id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <span className="text-zinc-900 dark:text-zinc-50">{t.text}</span>
                <span className="text-sm text-zinc-500">
                  {t.isCompleted ? "✅ Done" : "⏳ Todo"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
