"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { content } from "@/lib/content";
import SectionHeading from "@/components/SectionHeading";
import { Card3D, Card3DLayer } from "@/components/ui/3d-card";
import ViewMore from "@/components/ViewMore";

export default function Projects() {
  const t = content.projects;
  const linkLabel = (kind: string) => (kind === "live" ? t.live : t.code);
  const [expanded, setExpanded] = useState(false);

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

        <ul className="grid gap-5 md:grid-cols-2">
          {/* Extra cards stay mounted but hidden so ScrollReveal observes them and animates them in once shown. */}
          {t.items.map((project, i) => (
            <li key={project.title} data-reveal hidden={!expanded && i >= t.initialCount}>
              <Card3D className="group relative flex flex-col rounded-lg border border-line bg-raised transition-[border-color,box-shadow] duration-200 ease-out hover:border-line-strong hover:shadow-[0_12px_32px_rgb(0_0_0/0.12)]">
                {/* Whole-card click target; the title link below is the one keyboard stop. */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg"
                />

                {/* Lifted layers let clicks fall through to the card link, except the title link. */}
                <Card3DLayer depth={40} className="pointer-events-none p-3 pb-0">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line bg-tag">
                    <Image
                      src={project.preview}
                      alt={`Screenshot of ${project.title}`}
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </Card3DLayer>

                <Card3DLayer depth={24} className="pointer-events-none flex flex-1 flex-col p-5 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-balance font-display text-xl font-semibold text-ink">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto relative focus-visible:outline-none"
                      >
                        {project.title}
                        <span className="sr-only">({t.newTab})</span>
                      </a>
                    </h3>
                    <span className="flex-shrink-0 font-mono text-sm tabular-nums text-faint">{project.year}</span>
                  </div>

                  <p className="mt-2 text-muted">{project.desc}</p>

                  <div className="mt-auto flex flex-col gap-4 pt-5">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                      {project.tech.map((tech) => (
                        <li key={tech} className="tag">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <span aria-hidden="true" className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                      <span className="link">{linkLabel(project.kind)}</span>
                      <ArrowUpRight size={16} strokeWidth={1.5} />
                    </span>
                  </div>
                </Card3DLayer>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-accent opacity-0 group-focus-within:opacity-100"
                />
              </Card3D>
            </li>
          ))}
        </ul>

        <ViewMore
          label={t.viewMore}
          message={t.moreMessage}
          onExpand={expanded ? undefined : () => setExpanded(true)}
          collapse={expanded ? { label: t.showLess, onClick: () => setExpanded(false) } : undefined}
        />
      </div>
    </section>
  );
}
