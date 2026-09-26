"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { content } from "@/lib/content";
import { Marked } from "@/components/ui/marker-highlight";
import SectionHeading from "@/components/SectionHeading";
import { techIcons } from "@/lib/tech-icons";
import { PhotoZoom } from "@/components/ui/photo-zoom";

export default function About() {
  const t = content.about;
  const focus = content.focus;

  return (
    <section id="about" aria-labelledby="about-title" className="section border-b border-line">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading id="about-title" label={t.label} title={t.title} />

        <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-14">
          <div data-reveal className="space-y-4 text-muted">
            <p>{t.p1}</p>
            <p>{t.p2}</p>
            <p><Marked text={t.p3} /></p>
          </div>

          <aside data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <PhotoZoom src="/foto-profil.jpg" className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image src="/foto-profil.jpg" alt={t.photoAlt} fill sizes="80px" className="object-cover" />
              </PhotoZoom>
              <div>
                <p className="font-display text-lg font-semibold text-ink">Hosea Felix Sanjaya</p>
                <a
                  href="/CV_Hosea.pdf"
                  download="CV_Hosea_Felix_Sanjaya.pdf"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink"
                >
                  <Download size={16} strokeWidth={1.5} aria-hidden="true" />
                  <span className="link">{t.cv}</span>
                </a>
              </div>
            </div>

            <dl className="divide-y divide-line border-y border-line text-sm">
              {t.facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
                  <dt className="text-faint">{fact.label}</dt>
                  <dd className="font-medium text-ink">
                    {fact.value}
                    {"note" in fact && <span className="ml-1.5 text-xs font-normal text-faint">{fact.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <h3 data-reveal className="mt-14 font-display text-xl font-semibold text-ink">{focus.title}</h3>
        <ul className="mt-4 border-t border-line">
          {focus.items.map((item) => (
            <li
              key={item.title}
              data-reveal
              className="grid gap-2 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8"
            >
              <h4 className="font-semibold text-ink">{item.title}</h4>
              <div>
                <p className="text-muted">{item.desc}</p>
                <p className="mt-2 font-mono text-sm text-faint">{item.tags.join(" / ")}</p>
              </div>
            </li>
          ))}
        </ul>

        <div data-reveal>
          <h3 className="mt-10 text-sm text-faint">{t.skillsLabel}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {t.skills.map((skill) => (
              <li
                key={skill}
                title={skill}
                className="flex h-11 w-11 items-center justify-center rounded-md bg-tag text-tag-ink"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d={techIcons[skill]} />
                </svg>
                <span className="sr-only">{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
