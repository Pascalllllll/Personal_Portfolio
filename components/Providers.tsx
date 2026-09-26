"use client";

import { ThemeProvider } from "next-themes";
import ClickBurst from "@/components/ClickBurst";
import DirectionalCursor from "@/components/DirectionalCursor";
import FluidBackground from "@/components/FluidBackground";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <FluidBackground />
      {children}
      <ClickBurst />
      <DirectionalCursor />
    </ThemeProvider>
  );
}
