"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";
import ClickBurst from "@/components/ClickBurst";
import FluidBackground from "@/components/FluidBackground";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <FluidBackground />
      <LanguageProvider>{children}</LanguageProvider>
      <ClickBurst />
    </ThemeProvider>
  );
}
