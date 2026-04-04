"use client";

import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";

export default function Footer() {
  const { lang } = useLang();
  const t = content[lang].footer;
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-700 text-sm text-slate-900 dark:text-white">
            <span className="accent">H</span>F<span className="text-slate-400 dark:text-slate-700">.</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-600 font-sans">{t.tagline}</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-slate-400 dark:text-slate-600">
          <span>© {year} Hosea Felix Sanjaya.</span>
          <span>{t.rights}</span>
        </div>
      </div>
    </footer>
  );
}
