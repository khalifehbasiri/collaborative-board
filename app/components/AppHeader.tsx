"use client";

import Link from "next/link";
import { Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "./AuthButton";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Board" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Stories" },
  { href: "/blog", label: "Field notes" },
];

interface AppHeaderProps {
  showAuth?: boolean;
}

export function AppHeader({ showAuth = false }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-360 items-center gap-3 px-4 sm:px-6">
        <BrandMark />

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {showAuth ? (
            <AuthButton />
          ) : (
            <Link
              href="/dashboard#create"
              className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:flex"
            >
              <Plus className="size-4" aria-hidden="true" />
              Join the board
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-border text-foreground transition hover:bg-muted lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-border bg-surface px-4 py-3 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-360 grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-muted px-4 py-3 text-sm font-bold text-foreground transition hover:bg-border"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
