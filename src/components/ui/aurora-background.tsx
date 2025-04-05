"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AuroraBackground({
  className,
  containerClassName,
  children,
}: {
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCursorPosition({ x, y });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-black",
        containerClassName
      )}
    >
      <div
        className={cn("absolute inset-0 z-0", className)}
        style={{
          background: `
            radial-gradient(
              600px circle at ${cursorPosition.x}px ${cursorPosition.y}px, 
              rgba(100, 100, 255, 0.15), 
              transparent 40%
            ),
            radial-gradient(
              800px circle at ${cursorPosition.x - 200}px ${
            cursorPosition.y + 100
          }px, 
              rgba(120, 50, 255, 0.1), 
              transparent 40%
            ),
            radial-gradient(
              700px circle at ${cursorPosition.x + 300}px ${
            cursorPosition.y - 200
          }px, 
              rgba(220, 50, 255, 0.1), 
              transparent 40%
            ),
            radial-gradient(
              1000px circle at ${cursorPosition.x}px ${
            cursorPosition.y + 400
          }px, 
              rgba(50, 200, 255, 0.1), 
              transparent 40%
            )
          `,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Fixed aurora blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
