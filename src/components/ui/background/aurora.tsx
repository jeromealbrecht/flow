"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
}

export default function AuroraBackground({ children }: AuroraBackgroundProps) {
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      {children}
      <BackgroundBeams />
    </div>
  );
}
