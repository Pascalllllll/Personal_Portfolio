"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";

export default function Projects() {
  const { lang } = useLang();
  const t = content[lang].projects;
  const linkLabel = (kind: string) => (kind === "live" ? t.live : t.code);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section border-b border-line">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading id="projects-title" label={t.label} title={t.title}>
          <a
            href="https://github.com/Pascalllllll"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink"
          >
            <Github size={16} strokeWidth={1.5} aria-hidden="true" />
            <span className="link">{t.cta}</span>
            <span className="sr-only">({t.newTab})</span>
          </a>
        </SectionHeading>

        <ul className="flex flex-col gap-4">
          {t.items.map((project) => (
            <li key={project.title}>
              <article className="group relative rounded-lg border border-line bg-raised p-5 transition-colors duration-200 ease-out hover:border-line-strong md:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-medium text-ink">
                    {/* The ::after overlay makes the whole card the click target. */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                    >
                      {project.title}
                    </a>
                  </h3>
                  <span className="flex-shrink-0 font-mono text-sm text-faint">{project.year}</span>
                </div>

                <p className="mt-2 text-muted">{project.desc}</p>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                    {project.tech.map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex flex-shrink-0 items-center gap-1 text-sm font-medium text-ink">
                    <span className="link">{linkLabel(project.kind)}</span>
                    <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span className="sr-only">({t.newTab})</span>
                  </span>
                </div>

                {/* Focus ring on the card, since the focused element is the invisible overlay. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-purple opacity-0 group-focus-within:opacity-100"
                />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
