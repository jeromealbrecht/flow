"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminCheck } from "@/components/AdminCheck";
import AuroraBackground from "@/components/ui/background/aurora";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log(currentUser);
      } else {
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <AuroraBackground>
        <div className="flex justify-center items-center min-h-screen">
          Chargement...
        </div>
      </AuroraBackground>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuroraBackground>
      <div className="p-6 relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-opacity-80 backdrop-blur-lg">
            <CardHeader>
              <img
                src={user.photoURL}
                alt="Photo de profil"
                width={50}
                height={50}
                className="rounded-full"
              />
              <CardTitle>
                Bienvenue, {user.displayName || "Utilisateur"}
              </CardTitle>
              <CardDescription>
                Vous êtes connecté avec : {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Dernière connexion : {user.metadata.lastSignInTime}</p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => auth.signOut().then(() => router.push("/"))}
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
              <p>Projets actifs: {user?.projects}</p>
              <p>Tâches en attente: {user?.tasks}</p>
              <p>Notifications: {user?.notifications}</p>
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
          <Card className="bg-opacity-80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>
                <h1>Bienvenue sur le dashboard</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <AdminCheck user={user} />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AuroraBackground>
  );
}
