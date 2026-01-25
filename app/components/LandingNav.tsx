import Link from "next/link";
import { Menu } from "lucide-react";

export function LandingNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg">
          C
        </div>
        <span className="font-bold text-xl tracking-tight">COLLAB BOARD</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="#" className="hover:text-black transition-colors">About us</Link>
        <Link href="#" className="hover:text-black transition-colors">Reviews</Link>
        <Link href="#" className="hover:text-black transition-colors">Our blog</Link>
      </div>

      <div className="hidden md:block">
        <Link 
          href="/dashboard"
          className="px-6 py-2.5 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
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
