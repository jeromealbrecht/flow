"use client";

import { auth } from "@/lib/firebase/auth";
import { updateUserRole } from "@/lib/firebase/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminSetupPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid === "mKElDoMiVoVuY4P8VEetkwqj5jB2") {
        try {
          await updateUserRole(user.uid, true, ["admin"]);
          setMessage("Vous êtes maintenant administrateur ! Redirection...");
          setTimeout(() => router.push("/studio/admin"), 2000);
        } catch (error) {
          setMessage("Erreur lors de la configuration : " + error);
        }
      } else {
        setMessage("Accès non autorisé");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Configuration Admin</h1>
      <p>{message}</p>
    </div>
  );
}
