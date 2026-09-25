"use client";

import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";

export default function Hero() {
  const { lang } = useLang();
  const t = content[lang].hero;

  return (
    <section id="hero" className="border-b border-line">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-ink">
          {t.name}
          <span className="stop" aria-hidden="true">.</span>
        </h1>

        <p className="mt-6 text-xl font-medium text-ink md:text-2xl">{t.role}</p>
        <p className="mt-3 max-w-2xl text-muted md:text-lg">{t.description}</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#projects" className="btn-primary">
            {t.cta}
          </a>
          <a href="#contact" className="btn-outline">
            {t.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
