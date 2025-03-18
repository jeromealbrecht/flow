/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Download, Gift, Music, Share2, Trophy, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { logOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { auth } from "@/lib/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRoles, type Recording } from "@/lib/firebase/admin";

export default function Studio() {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>("");
  const [progress, setProgress] = useState(65);
  const [referralCode, setReferralCode] = useState("STUDIO-JOHN-2023");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour compter les vrais enregistrements
  const getRealRecordingsCount = () => {
    if (recordings.length === 0) return 0;
    if (
      recordings.length === 1 &&
      recordings[0].title === "Pas encore de titre enregistré"
    )
      return 0;
    return recordings.length;
  };

  // Mock data (same as before)
  const rewards = [
    { level: "Bronze", discount: "5%", threshold: 5, current: true },
    { level: "Silver", discount: "10%", threshold: 10, current: false },
    { level: "Gold", discount: "15%", threshold: 15, current: false },
    { level: "Platinum", discount: "20%", threshold: 20, current: false },
  ];

  const currentReward = rewards.find((reward) => reward.current);
  const nextReward = rewards[rewards.findIndex((reward) => reward.current) + 1];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = user.displayName || user.email || "Utilisateur";
        setUserName(name);

        // Création des initiales
        if (user.displayName) {
          const initials = user.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          setUserInitials(initials);
        } else {
          setUserInitials(user.email?.[0].toUpperCase() || "U");
        }

        // Récupération des enregistrements
        try {
          const userData = await getUserRoles(user);
          setRecordings(userData.recordings || []);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des enregistrements:",
            error
          );
        }
        setLoading(false);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setUserName(null);
      await logOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  if (!userName) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Studio Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
            <div className="flex items-center gap-2 mt-2">
              {isAdmin && (
                <>
                  <Badge variant="secondary">Administrateur</Badge>
                  <Button
                    variant="link"
                    onClick={() => router.push("/studio/admin")}
                    className="p-0 h-auto font-normal"
                  >
                    Accéder au panneau d&apos;administration
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="destructive" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Titres enregistrés
            </CardTitle>
            <CardDescription>
              Nombre total de titres enregistrés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {getRealRecordingsCount()}
                </span>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                {getRealRecordingsCount() > 0 ? "+1 ce mois" : "Aucun titre"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Reward
            </CardTitle>
            <CardDescription>Your studio loyalty benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {currentReward?.discount} Off
                </span>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                {currentReward?.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Referral Bonus
            </CardTitle>
            <CardDescription>Invite friends for discounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">10% Off</span>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                Per Referral
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recordings" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="recordings">Vos enregistrements</TabsTrigger>
          <TabsTrigger value="rewards">Programme de fidélité</TabsTrigger>
          <TabsTrigger value="referrals">Système de parrainage</TabsTrigger>
        </TabsList>

        <TabsContent value="recordings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vos titres enregistrés</CardTitle>
              <CardDescription>
                Téléchargez vos fichiers de mixage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recordings.length === 1 &&
                recordings[0].title === "Pas encore de titre enregistré" ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Music className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">
                      Aucun titre enregistré
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Commencez à enregistrer pour voir vos titres apparaître
                      ici
                    </p>
                  </div>
                ) : (
                  recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{recording.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Enregistré le{" "}
                          {recording.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            {!(
              recordings.length === 1 &&
              recordings[0].title === "Pas encore de titre enregistré"
            ) && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir tous les enregistrements
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programme de fidélité</CardTitle>
              <CardDescription>
                Suivez votre progression vers le prochain niveau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Progression vers {nextReward?.level}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getRealRecordingsCount()}/{nextReward?.threshold}{" "}
                    enregistrements
                  </span>
                </div>
                <Progress
                  value={
                    (getRealRecordingsCount() / (nextReward?.threshold || 1)) *
                    100
                  }
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.level}
                    className={`p-4 border rounded-lg ${
                      reward.current ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Gift
                        className={`h-5 w-5 ${
                          reward.current
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <h3 className="font-medium">{reward.level}</h3>
                      {reward.current && (
                        <Badge variant="outline" className="ml-auto">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      {reward.discount} Off
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requires {reward.threshold} recordings
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Record {nextReward?.threshold - getRealRecordingsCount()} more
                titles to reach {nextReward?.level} level and get{" "}
                {nextReward?.discount} off your next session!
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral System</CardTitle>
              <CardDescription>
                Invite friends and earn discounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">How it works</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Share your unique referral code with friends</li>
                  <li>When they book their first session, they get 5% off</li>
                  <li>
                    After their session, you receive 10% off your next booking
                  </li>
                  <li>
                    There&apos;s no limit to how many friends you can refer!
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral-code">Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="referral-code"
                    value={referralCode}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(referralCode);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Successful Referrals</h3>
                    <p className="text-sm text-muted-foreground">
                      Friends who&apos;ve used your code
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold">2</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share Your Code
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Terms and conditions apply. Referral discounts cannot be
                combined with other offers.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
