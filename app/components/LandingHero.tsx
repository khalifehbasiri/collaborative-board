import Link from "next/link";
import { Apple, Play, MapPin, Calendar, User } from "lucide-react";

export function LandingHero() {
  return (
    <div className="relative overflow-hidden bg-muted min-h-[calc(100vh-80px)] rounded-[40px] mx-4 mb-4 p-8 md:p-16 flex flex-col md:flex-row items-center">
      {/* Background Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-indigo-100 rounded-t-[50%] scale-150 translate-y-1/3 z-0 blur-3xl opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 max-w-xl">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground mb-2">
          PLAN YOUR
        </h1>
        <h1 className="text-5xl md:text-7xl font-serif italic font-light text-foreground mb-8">
          IDEAS
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
          We have the best platform for real-time collaboration. 
          Share ideas, vote on features, and build together. 
          24-hour support is always happy to answer all your questions.
        </p>

        <Link 
          href="/dashboard"
          className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-full font-medium text-lg hover:opacity-90 transition-colors mb-12"
        >
          Get Started
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-muted-foreground max-w-25 leading-tight">
            The app is available now
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center border border-border hover:border-foreground transition-colors">
              <Apple className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center border border-border hover:border-foreground transition-colors">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="relative z-10 flex-1 w-full flex justify-center md:justify-end mt-12 md:mt-0">
        <div className="relative w-75 h-150 bg-accent rounded-[40px] p-3 shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-4xl overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-accent rounded-b-xl z-20"></div>
            
            {/* App Header */}
            <div className="pt-12 px-6 pb-4 bg-muted">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-bold">My Boards</h2>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
              </div>
              <div className="flex gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span className="text-foreground border-b-2 border-foreground pb-1">Active</span>
                <span>Archived</span>
                <span>Shared</span>
              </div>
            </div>

            {/* App Content */}
            <div className="p-4 space-y-4">
              {/* Card 1 */}
              <div className="bg-muted p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Product Roadmap</h3>
                  <div className="bg-background px-2 py-1 rounded-full text-xs font-bold">v2.0</div>
                </div>
                <div className="flex -space-x-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white"></div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Remote
                  </div>
                  <button className="px-3 py-1 bg-background rounded-full border border-border">Open</button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-muted p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">Marketing Ideas</h3>
                  <div className="bg-background px-2 py-1 rounded-full text-xs font-bold">Q1</div>
                </div>
                <div className="h-24 bg-background/50 rounded-xl mb-3 overflow-hidden relative">
                   {/* Abstract image placeholder */}
                   <div className="absolute inset-0 bg-linear-to-br from-purple-200 to-blue-200"></div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Jan 24
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> 12 members
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 border-t border-border p-4 flex justify-around text-muted-foreground backdrop-blur-sm">
              <div className="w-6 h-6 bg-accent rounded-full"></div>
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <div className="w-6 h-6 bg-muted rounded-full"></div>
            </div>
          </div>
          
          {/* Side Buttons */}
          <div className="absolute top-24 -left-1 w-1 h-8 bg-foreground/60 rounded-l"></div>
          <div className="absolute top-36 -left-1 w-1 h-12 bg-foreground/60 rounded-l"></div>
          <div className="absolute top-28 -right-1 w-1 h-16 bg-foreground/60 rounded-r"></div>
        </div>
      </div>
    </div>
  );
}
