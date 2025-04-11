"use client";

// import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    if (!loading) {
      if (!isAdmin) {
        router.push("/");
      } else {
        setCanRender(true);
      }
    }
  }, [router, isAdmin, loading]);

  if (loading) {
    return <div>Vérification des droits...</div>;
  }

  if (!canRender) {
    return null;
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
