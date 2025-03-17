"use client";

import { Button } from "@/components/ui/button";
import { ChromeIcon as Google } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

export function GoogleSignIn() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/studio"); // Redirection vers le dashboard après la connexion
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      className="w-full flex items-center justify-center gap-2"
    >
      <Google className="w-5 h-5" />
      Sign in with Google
    </Button>
  );
}
