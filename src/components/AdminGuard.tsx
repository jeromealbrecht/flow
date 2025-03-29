"use client";

// import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  // Version simplifiée pour test
  const isAdmin = true; // Forcé à true pour test

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    } else {
      setCanRender(true);
    }
  }, [router]);

  if (!canRender) {
    return <div>Vérification des droits...</div>;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-4"
        onClick={() => router.push("/studio")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au studio
      </Button>
      {children}
    </div>
  );
}
