"use client";

import { AuthButton } from "./AuthButton";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            Collaborative Board
          </h1>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
