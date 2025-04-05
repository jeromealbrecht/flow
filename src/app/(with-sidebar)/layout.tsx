import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SideBar } from "@/components/menu/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing users and settings",
};

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-72 flex-col fixed inset-y-0">
        <SideBar />
      </div>
      <main className="md:pl-72 flex-1">{children}</main>
    </div>
  );
}
