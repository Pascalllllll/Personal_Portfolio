import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/lib/site";

// SF Pro can't be served on the web, so Apple devices get the real system font and everyone else
// gets Inter (the closest open match), with its optical-size axis standing in for SF Text/Display.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  axes: ["opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400"],
  display: "swap",
});

const DESCRIPTION =
  "Portfolio of Hosea Felix Sanjaya, Informatics Engineering student at ITS Surabaya working on data analysis, databases, and a heavily themed Debian desktop.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hosea Felix Sanjaya | Informatics Student at ITS Surabaya",
  description: DESCRIPTION,
  keywords: ["Hosea Felix Sanjaya", "data analysis", "databases", "ITS Surabaya", "Informatics", "Debian", "Linux ricing", "portfolio"],
  authors: [{ name: "Hosea Felix Sanjaya", url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Hosea Felix Sanjaya",
    title: "Hosea Felix Sanjaya",
    description: DESCRIPTION,
    locale: "en_US",
    firstName: "Hosea Felix",
    lastName: "Sanjaya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hosea Felix Sanjaya",
    description: DESCRIPTION,
  },
};

// Browser chrome (mobile address bar) matches the page background in each theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("reveal");try{if(!sessionStorage.getItem("os-gate-done"))throw 0}catch(e){document.documentElement.classList.add("gate-open")}`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
