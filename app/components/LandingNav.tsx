import Link from "next/link";
import { Menu, Moon, SunMedium } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function LandingNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg">
          C
        </div>
        <span className="font-bold text-xl tracking-tight">COLLAB BOARD</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">About us</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Reviews</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Our blog</Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <ThemeToggle />
        <Link 
          href="/dashboard"
          className="px-6 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Go to Board
        </Link>
      </div>

      <button className="md:hidden p-2">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
