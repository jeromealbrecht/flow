"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export const EmailSignIn = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      // Si l'utilisateur existe (409) ou si la connexion est réussie
      toast.success("Connexion réussie");
      console.log("Utilisateur connecté :", data);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/studio/dashboard");
    } catch (error) {
      console.error("Erreur:", error);
      if (error instanceof Error) {
        setError(error.message);
        toast.error("Erreur", { description: error.message });
      } else {
        setError("Une erreur est survenue");
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-pulse">Connexion en cours...</span>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
};
