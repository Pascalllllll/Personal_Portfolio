"use client";

import { content } from "@/lib/content";
import TypingName from "@/components/TypingName";

export default function Hero() {
  const t = content.hero;

  return (
    <section id="hero" className="border-b border-line">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
        <h1 data-reveal className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-ink">
          <TypingName name={t.name} phrases={t.typing} />
        </h1>

        <p data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="mt-6 text-xl font-medium text-ink md:text-2xl">{t.role}</p>
        <p data-reveal style={{ "--reveal-delay": "200ms" } as React.CSSProperties} className="mt-3 max-w-2xl text-muted md:text-lg">{t.description}</p>

        <div data-reveal style={{ "--reveal-delay": "300ms" } as React.CSSProperties} className="mt-10 flex flex-col gap-3 sm:flex-row">
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
