"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuroraBackground from "@/components/ui/background/aurora";
import AudioFrontManagement from "../components/AudioFrontManagement";

interface CustomUser extends User {
  projects?: number;
  tasks?: number;
  notifications?: number;
}

interface SQLUser {
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  projects?: number;
  tasks?: number;
  notifications?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<CustomUser | SQLUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Utilisateur Firebase
        setUser(currentUser);
        console.log("Utilisateur Firebase connecté:", currentUser);
      } else {
        // Vérifier le localStorage pour un utilisateur SQL
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const sqlUser = JSON.parse(storedUser);
            setUser(sqlUser);
            console.log("Utilisateur SQL connecté:", sqlUser);
          } catch (error) {
            console.error("Erreur de parsing du localStorage:", error);
            router.push("/");
          }
        } else {
          router.push("/");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <AuroraBackground>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuroraBackground>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    if ("uid" in user) {
      // Déconnexion Firebase
      await auth.signOut();
    } else {
      // Déconnexion SQL
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  return (
    <AuroraBackground>
      <div className="p-6 relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-opacity-80 backdrop-blur-lg">
            <CardHeader>
              <div className="w-12 h-12">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Photo de profil"
                  width="48"
                  height="48"
                  className="rounded-full object-cover w-full h-full"
                  loading="eager"
                />
              </div>
              <CardTitle>
                Bienvenue, {user.displayName || "Utilisateur"}
              </CardTitle>
              <CardDescription>
                Vous êtes connecté avec : {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {"metadata" in user && (
                <p>Dernière connexion : {user.metadata.lastSignInTime}</p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleLogout}
              >
                Se déconnecter
              </button>
            </CardContent>
          </Card>

          <Card className="bg-opacity-80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Vos récompenses</CardTitle>
              <CardDescription>Aperçu de vos activités</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Projets actifs: {user?.projects || 0}</p>
              <p>Tâches en attente: {user?.tasks || 0}</p>
              <p>Notifications: {user?.notifications || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-opacity-80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accès rapide aux fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Nouveau projet
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Ajouter une tâche
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Voir les rapports
              </button>
            </CardContent>
          </Card>
        </div>

        <section className="mt-10 w-full">
          <AudioFrontManagement />
        </section>
      </div>
    </AuroraBackground>
  );
}
