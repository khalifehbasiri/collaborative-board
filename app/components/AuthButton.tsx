"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10",
          },
        }}
      />
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <SignInButton mode="modal">
        <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:active:bg-zinc-600">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:active:bg-zinc-200">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
