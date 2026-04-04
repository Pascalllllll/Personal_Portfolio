"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const { lang } = useLang();
  const t = content[lang].hero;

  // --- Logika Animasi Ketik ---
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Daftar kata yang akan dianimasikan
  const typingWords = ["Data Enthusiast", "Gaming Enthusiast", "Unemployed"];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      const currentWordIndex = loopNum % typingWords.length;
      const fullText = typingWords[currentWordIndex];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(50); // Kecepatan menghapus
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100); // Kecepatan mengetik
      }

      if (!isDeleting && text === fullText) {
        // Jeda setelah mengetik selesai
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        // Ganti ke kata berikutnya setelah dihapus
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Jeda sebelum mulai mengetik kata baru
      } else {
        // Lanjutkan mengetik/menghapus
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);
  // -----------------------------

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-start justify-center overflow-hidden"
    >
      {/* Animated Square Grid */}
      <div className="bg-grid-animated" />

      {/* Radial glow — subtle center bloom */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-0 dark:opacity-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full pt-32 pb-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp} className="mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t.badge}
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={fadeInUp}
          className="text-base md:text-lg font-mono text-slate-500 dark:text-slate-500 mb-3 tracking-wide"
        >
          {t.greeting}
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-800 tracking-tight text-slate-900 dark:text-white leading-[0.95] mb-4"
        >
          {t.name}
          <span className="accent">.</span>
        </motion.h1>

        {/* Role (Typing Animation) + Institution Row */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 mt-6"
        >
          <div className="flex items-center min-h-[32px] md:min-h-[40px]"> {/* Container untuk menjaga tinggi tetap */}
            <span className="font-display text-xl md:text-3xl font-600 text-slate-700 dark:text-slate-300 tracking-tight">
              {text}
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[2px] h-[1.2em] bg-slate-700 dark:bg-slate-300 ml-1"
            />
          </div>
          <span className="hidden sm:block w-px h-5 bg-slate-300 dark:bg-white/10" />
          <span className="font-mono text-sm text-slate-400 dark:text-slate-500">
            {t.institution}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="max-w-xl text-base md:text-lg font-sans font-light text-slate-500 dark:text-slate-400 leading-relaxed mb-12"
        >
          {t.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center gap-4"
        >
          <a href="#projects" className="btn-primary group">
            {t.cta}
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
          <a href="#contact" className="btn-outline">
            {t.ctaSecondary}
          </a>
        </motion.div>

        {/* Tech row */}
        <motion.div
          variants={fadeInUp}
          className="mt-20 flex items-center gap-3 flex-wrap"
        >
          <span className="text-xs font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase">
            Stack
          </span>
          <span className="w-8 h-px bg-slate-200 dark:bg-white/10" />
          {/* Diperbarui agar sesuai dengan keahlian Data Enthusiast */}
          {["Python", "SQL", "Next.js", "Java", "Git"].map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded border border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown
            size={16}
            className="text-slate-400 dark:text-slate-600"
          />
        </motion.div>
      </motion.div>

      {/* Bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 rule" />
    </section>
  );
}