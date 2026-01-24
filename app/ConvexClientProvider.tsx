"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ReactNode, useMemo, useEffect } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  const convex = useMemo(() => {
    return new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }, []);

  useEffect(() => {
    // Wait for Clerk to be fully loaded before setting auth
    if (!isLoaded) return;

    const updateAuth = async () => {
      try {
        const token = await getToken({ template: "convex" });
        
        if (token) {
          convex.setAuth(async () => {
            const token = await getToken({ template: "convex" });
            return token || null;
          });
        } else {
          convex.clearAuth();
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
        convex.clearAuth();
      }
    };

    updateAuth();
    
    // Set up interval to refresh token
    const interval = setInterval(updateAuth, 60000);
    return () => clearInterval(interval);
  }, [convex, getToken, isLoaded]);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
