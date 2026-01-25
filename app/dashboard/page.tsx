"use client";

import { Navigation } from "../components/Navigation";
import { PostForm } from "../components/PostForm";
import { PostList } from "../components/PostList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-black">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <PostForm />
          <PostList />
        </div>
      </main>
    </div>
  );
}
