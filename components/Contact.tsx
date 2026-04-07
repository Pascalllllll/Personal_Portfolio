"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { content } from "@/lib/content";
import { fadeInUp, slideInLeft, slideInRight } from "@/lib/animations";
import { FloatingPaths } from "@/components/ui/background-paths";

export default function Contact() {
  const { lang } = useLang();
  const t = content[lang].contact;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "27207f0c-efea-437c-bc6a-93e44e2452f0",
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio Contact from: ${form.name}`,
          from_name: "Hosea Felix Portfolio",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        console.error("Web3Forms Error:", result);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const socials = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Pascalllllll",
      handle: "@Pascalllllll",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hoseafs-3a9a0931b/",
      handle: "Hosea Felix Sanjaya",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:hoseeee777@gmail.com",
      handle: "hoseeee777@gmail.com",
    },
  ];

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] text-sm font-sans text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)] transition-all duration-200";

  return (
    <section id="contact" className="section relative overflow-hidden" ref={ref}>
      
      {/* Background Animasi Shadcn */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

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

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Heading + Socials */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-700 text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {t.title}
            </h2>
            <p className="font-sans font-light text-slate-500 dark:text-slate-400 leading-relaxed mb-14">
              {t.subtitle}
            </p>

            {/* Socials */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 dark:text-slate-600 mb-5">
                {t.orReach}
              </p>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, href, handle }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.14] bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent-dim)] transition-all duration-200 flex-shrink-0">
                      <Icon size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-0.5">
                        {label}
                      </div>
                      <div className="text-sm font-sans font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {handle}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.05]"
              >
                <CheckCircle size={36} className="text-emerald-500 mb-4" />
                <p className="font-display font-600 text-slate-800 dark:text-slate-200 text-lg mb-2">
                  {t.success}
                </p>
              </motion.div>
            ) : status === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.05]"
              >
                <AlertCircle size={36} className="text-red-500 mb-4" />
                <p className="font-display font-600 text-slate-800 dark:text-slate-200 text-lg mb-2">
                  {lang === "en" ? "Oops! Something went wrong." : "Waduh! Terjadi kesalahan."}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {lang === "en" ? "Please try again later." : "Silakan coba lagi nanti."}
                </p>
              </motion.div>
            ) : (
              // Tampilan Form Input
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder={t.namePlaceholder}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputBase}
                    disabled={status === "sending"}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputBase}
                    disabled={status === "sending"}
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={5}
                    placeholder={t.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputBase} resize-none`}
                    disabled={status === "sending"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      {t.send}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}