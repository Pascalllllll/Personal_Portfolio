import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hosea Felix Sanjaya | Portfolio",
  description:
    "Personal portfolio of Hosea Felix Sanjaya, an Informatics Engineering student at ITS Surabaya specializing in software engineering, computer networking, and data analysis.",
  keywords: ["software engineer", "ITS", "robotics", "networking", "portfolio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(syne.variable, dmSans.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="grain">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
