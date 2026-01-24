"use client";

import { Navigation } from "./components/Navigation";
import { PostForm } from "./components/PostForm";
import { PostList } from "./components/PostList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="space-y-6">
          <PostForm />
          <PostList />
        </div>
      </main>
    </div>
  );
}
