"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg">
          C
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">COLLAB BOARD</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">About us</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Reviews</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Our blog</Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <AuthButton />
        <button className="md:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
