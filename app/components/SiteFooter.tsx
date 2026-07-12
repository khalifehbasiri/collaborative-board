import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

const footerLinks = [
  { href: "/dashboard", label: "Live board" },
  { href: "/about", label: "How it works" },
  { href: "/reviews", label: "Community stories" },
  { href: "/blog", label: "Field notes" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-310 flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            A clearer place for communities to surface ideas and make decisions together.
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            © {new Date().getFullYear()} Collab Board
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
