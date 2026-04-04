"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Network, Database, Layers } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const iconMap = {
  Code2,
  Network,
  Database,
  Layers,
};

export default function Services() {
  const { lang } = useLang();
  const t = content[lang].services;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section relative overflow-hidden" ref={ref}>
      <div className="bg-pattern-diagonal" />
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

        {/* Heading */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-700 text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.1 }}
            className="font-sans font-light text-slate-500 dark:text-slate-400 leading-relaxed self-end"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {t.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative p-7 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] card-hover"
              >
                {/* Icon */}
                <div className="mb-6 w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-dim)] transition-all duration-300">
                  {Icon && (
                    <Icon
                      size={18}
                      className="text-slate-500 dark:text-slate-400 group-hover:text-[var(--accent)] transition-colors duration-300"
                    />
                  )}
                </div>

                {/* Number */}
                <div className="absolute top-6 right-6 font-mono text-xs text-slate-300 dark:text-white/10 group-hover:text-slate-400 dark:group-hover:text-white/20 transition-colors duration-300 select-none">
                  0{i + 1}
                </div>

                {/* Content */}
                <h3 className="font-display text-base font-600 text-slate-800 dark:text-slate-100 mb-3 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm font-sans font-light text-slate-500 dark:text-slate-500 leading-relaxed mb-5">
                  {item.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-white/[0.06] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-transparent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-6 md:left-8 right-6 md:right-8 rule" />
    </section>
  );
}
