"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="size-10 animate-pulse rounded-full bg-muted" aria-hidden="true" />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "size-10 border border-border",
          },
        }}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button className="hidden rounded-full px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 sm:block">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2">
          Join
        </button>
      </SignUpButton>
    </div>
  );
}
