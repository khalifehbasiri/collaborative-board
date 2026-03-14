import { LandingNav } from "./components/LandingNav";
import { LandingHero } from "./components/LandingHero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNav />
      <main>
        <LandingHero />
      </main>
    </div>
  );
}
