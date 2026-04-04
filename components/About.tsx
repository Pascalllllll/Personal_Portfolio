"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download } from "lucide-react"; 
import Image from "next/image"; 
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/animations";

export default function About() {
  const { lang } = useLang();
  const t = content[lang].about;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section relative overflow-hidden" ref={ref}>
      <div className="bg-pattern-dots" />
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

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Bio */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-700 text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
              {t.title}
            </h2>

            <div className="space-y-5 text-slate-500 dark:text-slate-400 font-sans font-light leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
              <p>{t.p3}</p>
            </div>

            {/* Skills Tags */}
            <div className="mt-10">
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 dark:text-slate-600 mb-4">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {t.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-3 py-1.5 rounded border border-slate-200 dark:border-white/[0.07] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Stats */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {t.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: 0.1 * i }}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="font-display text-3xl font-800 text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500 tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Profile Card */}
            <div className="mt-2 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/60 dark:bg-[#0d1117]/80 backdrop-blur-md shadow-xl dark:shadow-2xl group">
              <div className="flex items-center sm:items-start gap-6 sm:gap-8">
                
                {/* Foto-profile */}
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-white/10 flex-shrink-0 shadow-md">
                  <Image
                    src="/foto-profil.jpg" 
                    alt="Hosea Felix Sanjaya"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                
                {/* Info Text */}
                <div className="flex flex-col justify-center py-1">
                  <div className="font-display font-bold text-slate-900 dark:text-white text-base md:text-xl mb-1">
                    Hosea Felix Sanjaya
                  </div>
                  <div className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-4 md:mb-5">
                    Surabaya, Indonesia
                  </div>
                  
                  {/* Tombol Download CV dengan Dua Bahasa */}
                  <a
                    href="/CV_Hosea.pdf" 
                    download="CV_Hosea_Felix_Sanjaya.pdf" 
                    className="inline-flex items-center gap-2.5 group/btn"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium tracking-wide text-emerald-600 dark:text-emerald-400 group-hover/btn:text-emerald-700 dark:group-hover/btn:text-emerald-300 transition-colors flex items-center">
                      {lang === "en" ? "Download CV" : "Unduh CV"}
                      <Download size={15} className="ml-1.5 transform group-hover/btn:translate-y-0.5 transition-transform" />
                    </span>
                  </a>
                  
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-6 md:left-8 right-6 md:right-8 rule" />
    </section>
  );
}