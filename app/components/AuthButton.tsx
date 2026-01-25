"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
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
    <div className="flex items-center gap-3">
      <SignInButton mode="modal">
        <button className="hidden sm:block px-6 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-black hover:border-black transition-colors">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
