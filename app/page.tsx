import { LandingNav } from "./components/LandingNav";
import { LandingHero } from "./components/LandingHero";
import { SiteFooter } from "./components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <LandingNav />
      <main>
        <LandingHero />
      </main>
      <SiteFooter />
    </div>
  );
}
