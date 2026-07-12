import Link from "next/link";
import { CircleHelp, Flame, Home, Lightbulb, MessageSquareText, Plus } from "lucide-react";

const feedLinks = [
  { href: "/dashboard", label: "Home feed", icon: Home },
  { href: "/dashboard#feed", label: "Popular now", icon: Flame },
  { href: "/dashboard#create", label: "Create a post", icon: Plus },
];

const topicLinks = [
  { href: "/dashboard#feed", label: "Suggestions", icon: Lightbulb, color: "text-accent" },
  { href: "/dashboard#feed", label: "Questions", icon: CircleHelp, color: "text-secondary" },
  { href: "/dashboard#feed", label: "Open topics", icon: MessageSquareText, color: "text-violet-500" },
];

export function BoardSidebar() {
  return (
    <aside className="sticky top-20 hidden self-start lg:block">
      <nav aria-label="Board navigation">
        <p className="px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Board
        </p>
        <div className="mt-2 space-y-1">
          {feedLinks.map(({ href, label, icon: Icon }, index) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-surface ${
                index === 0 ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`size-4 ${index === 1 ? "text-accent" : ""}`} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>

        <p className="mt-8 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Conversation types
        </p>
        <div className="mt-2 space-y-1">
          {topicLinks.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-surface hover:text-foreground"
            >
              <Icon className={`size-4 ${color}`} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
