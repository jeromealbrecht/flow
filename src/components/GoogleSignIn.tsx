"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();

      // Authentification avec Google
      const result = await signInWithPopup(auth, provider);

      // Authentification réussie
      console.log("Utilisateur connecté:", result.user);

      // Rediriger vers le dashboard dans le dossier (with-sidebar)/studio
      router.push("/studio");
    } catch (error) {
      console.error("Erreur d'authentification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-pulse">Connexion en cours...</span>
      ) : (
        <>
          <FcGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </>
      )}
    </Button>
  );
};
