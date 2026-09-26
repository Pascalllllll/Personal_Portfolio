"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { content } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import { LinkPreview } from "@/components/ui/link-preview";

export default function Projects() {
  const t = content.projects;
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
            <li key={project.title} data-reveal>
              <article className="group relative rounded-lg border border-line bg-raised p-5 transition-colors duration-200 ease-out hover:border-line-strong md:p-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg"
                />
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-balance font-display text-xl font-semibold text-ink">
                    <LinkPreview
                      url={project.link}
                      external
                      isStatic
                      imageSrc={project.preview}
                      className="relative z-10 focus-visible:outline-none"
                    >
                      {project.title}
                    </LinkPreview>
                  </h3>
                  <span className="flex-shrink-0 font-mono text-sm tabular-nums text-faint">{project.year}</span>
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

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-accent opacity-0 group-focus-within:opacity-100"
                />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
