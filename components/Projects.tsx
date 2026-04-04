"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const tagColors: Record<string, string> = {
  Robotics:   "text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
  Robotika:   "text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
  Networking: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
  Jaringan:   "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
  "Web App":        "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
  "Aplikasi Web":   "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
  IoT:        "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  Algorithm:  "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
  Algoritma:  "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
};

export default function Projects() {
  const { lang } = useLang();
  const t = content[lang].projects;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section relative overflow-hidden" ref={ref}>
      <div className="bg-pattern-grid-lg" />
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex items-center gap-3 mb-16"
        >
          <span className="text-xs font-mono tracking-widest uppercase accent">{t.label}</span>
          <span className="flex-1 max-w-12 h-px bg-slate-200 dark:bg-white/10" />
        </motion.div>

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-700 text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>
          <motion.a
            href="https://github.com/Pascalllllll"
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-b border-transparent hover:border-current transition-all duration-200 pb-0.5 whitespace-nowrap"
          >
            <Github size={14} />
            {t.cta}
          </motion.a>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6 lg:gap-8" // <--- Dibuat 2 kolom dengan jarak lebih lega
        >
          {t.items.map((project, i) => (
            <motion.article
              key={i}
              variants={fadeInUp}
              className="group relative flex flex-col p-7 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] card-hover overflow-hidden"
            >
              {/* Featured gradient accent */}
              {project.featured && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono font-500 px-2.5 py-1 rounded-full border ${
                      tagColors[project.tag] ||
                      "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {project.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-300 dark:text-white/20">
                    {project.year}
                  </span>
                </div>

                {/* Arrow icon */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-slate-400 dark:text-white/20 group-hover:border-[var(--accent)]/30 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent-dim)] transition-all duration-300 flex-shrink-0"
                  aria-label={`View ${project.title}`}
                >
                  <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-700 text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                {project.title}
              </h3>
              <p className="text-sm font-sans font-light text-slate-500 dark:text-slate-500 leading-relaxed flex-1 mb-6">
                {project.desc}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-slate-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-6 md:left-8 right-6 md:right-8 rule" />
    </section>
  );
}