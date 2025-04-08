"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "firebase/auth";

export function AdminCheck({ user }: { user: User }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/check-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: { uid: user.uid } }),
        });

        if (!response.ok) {
          console.error("Failed to check admin status");
          return;
        }

        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    if (user?.uid) {
      checkAdmin();
    }
  }, [user]);

  if (!isAdmin) return null;

  return (
    <Link href="/studio/users" className="text-blue-500 hover:text-blue-700">
      Voir le dashboard des utilisateurs
    </Link>
  );
}
