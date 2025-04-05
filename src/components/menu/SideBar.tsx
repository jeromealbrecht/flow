"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Home, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideBar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Accueil",
      icon: Home,
      href: "/studio",
      active: pathname === "/studio",
    },
    {
      label: "Enregistrements",
      icon: Music,
      href: "/studio/recordings",
      active: pathname === "/studio/recordings",
    },
    {
      label: "Administration",
      icon: Users,
      href: "/studio/admin",
      active: pathname === "/studio/admin",
    },
    {
      label: "Paramètres",
      icon: Settings,
      href: "/studio/settings",
      active: pathname === "/studio/settings",
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Studio Smart</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className="w-full">
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
