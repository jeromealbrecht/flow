import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/auth";
import { isUserAdmin } from "@/lib/firebase/admin";
import { onAuthStateChanged } from "firebase/auth";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const adminStatus = await isUserAdmin(user);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      setIsAdmin(false);
      setLoading(false);
    };
  }, []);

  return { isAdmin, loading };
};
