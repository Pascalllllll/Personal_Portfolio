"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Home, Moon, Sun, Menu, X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import MusicPlayer from "@/components/MusicPlayer";

const control =
  "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-line-strong px-2.5 text-ink transition-colors duration-200 ease-out hover:border-ink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const t = content[lang].nav;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const navLinks = [
    { label: t.projects, href: "#projects" },
    { label: t.about, href: "#about" },
    { label: t.contact, href: "#contact" },
  ];

  // The server can't know the theme, so treat it as unknown until mount or the aria-label won't hydrate.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "nav-glass border-b border-line"
          : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-purple-soft focus:px-4 focus:py-2.5 focus:text-ink"
      >
        {t.skip}
      </a>

      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <a
          href="#hero"
          className="inline-flex h-11 min-w-11 items-center text-ink"
          aria-label={t.home}
          onClick={() => setMobileOpen(false)}
        >
          <Home size={20} strokeWidth={1.5} aria-hidden="true" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex h-11 items-center px-3 text-sm font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <MusicPlayer className={control} />

          <button
            type="button"
            onClick={toggleLang}
            className={`${control} font-mono text-xs`}
            aria-label={t.toggleLang}
          >
            {lang === "en" ? "ID" : "EN"}
          </button>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={control}
            aria-label={isDark ? t.toLight : t.toDark}
          >
            {/* Icon waits for mount so the server render cannot show the wrong theme. */}
            {mounted ? isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} /> : <span className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className={`${control} text-sm font-medium md:hidden`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
            {mobileOpen ? t.close : t.menu}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-line bg-paper md:hidden">
          <ul className="mx-auto flex max-w-4xl flex-col px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-12 items-center text-base font-medium text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
