"use client";

// import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  // const { isAdmin, loading } = useAdmin();
  const router = useRouter();
  // const [canRender, setCanRender] = useState(false);

  // console.log("isAdmin", isAdmin);

  // useEffect(() => {
  //   const checkAdmin = async () => {
  //     if (!loading) {
  //       if (!isAdmin) {
  //         router.push("/");
  //       } else {
  //         setCanRender(true);
  //       }
  //     }
  //   };

  //   checkAdmin();
  // }, [isAdmin, loading, router]);

  // if (loading || !canRender) {
  //   return <div>Chargement...</div>;
  // }

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
