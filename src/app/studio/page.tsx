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

export default function Studio() {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [userName, setUserName] = useState<string | null>(null);
  const [progress, setProgress] = useState(65);
  const [referralCode, setReferralCode] = useState("STUDIO-JOHN-2023");

  // Mock data (same as before)
  const recordings = [
    { id: 1, title: "Summer Vibes", date: "2023-10-15", downloadUrl: "#" },
    { id: 2, title: "Midnight Dreams", date: "2023-11-02", downloadUrl: "#" },
    { id: 3, title: "Urban Flow", date: "2023-12-10", downloadUrl: "#" },
    { id: 4, title: "Acoustic Session", date: "2024-01-05", downloadUrl: "#" },
  ];

  const rewards = [
    { level: "Bronze", discount: "5%", threshold: 5, current: true },
    { level: "Silver", discount: "10%", threshold: 10, current: false },
    { level: "Gold", discount: "15%", threshold: 15, current: false },
    { level: "Platinum", discount: "20%", threshold: 20, current: false },
  ];

  const currentReward = rewards.find((reward) => reward.current);
  const nextReward = rewards[rewards.findIndex((reward) => reward.current) + 1];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "Utilisateur");
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
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Bienvenue, {userName}</h1>
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
              Recorded Titles
            </CardTitle>
            <CardDescription>
              Total tracks recorded at our studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{recordings.length}</span>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                +1 this month
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
          <TabsTrigger value="recordings">Your Recordings</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Program</TabsTrigger>
          <TabsTrigger value="referrals">Referral System</TabsTrigger>
        </TabsList>

        <TabsContent value="recordings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Recorded Titles</CardTitle>
              <CardDescription>Download your mixing files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{recording.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Recorded on {recording.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Download Mix
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Recordings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Program</CardTitle>
              <CardDescription>
                Track your progress towards the next reward level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Progress to {nextReward?.level}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {recordings.length}/{nextReward?.threshold} recordings
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
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
                Record {nextReward?.threshold - recordings.length} more titles
                to reach {nextReward?.level} level and get{" "}
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
