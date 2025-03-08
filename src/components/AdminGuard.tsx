"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/studio");
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
