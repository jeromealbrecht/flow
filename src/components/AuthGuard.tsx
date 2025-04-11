"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier le token SQL dans les cookies
    const sqlToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // L'utilisateur est authentifié si :
      // 1. Il a un token Firebase valide OU
      // 2. Il a un token SQL valide
      const authenticated = !!user || !!sqlToken;
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      if (!authenticated) {
        router.push("/studio");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
