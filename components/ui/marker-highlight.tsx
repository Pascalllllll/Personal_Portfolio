"use client";

import { motion, useInView, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GATE_DONE_EVENT } from "@/components/OsGate";

interface MarkerHighlightProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait after the phrase comes into view. */
  delay?: number;
}

// Accent marker that springs across the phrase when it scrolls into view; the text turns dark under it.
export function MarkerHighlight({ children, className, delay = 0.2 }: MarkerHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();
  const [gateDone, setGateDone] = useState(false);
  const scale = useSpring(0, { stiffness: 100, damping: 14, mass: 1 });
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains("gate-open")) return setGateDone(true);
    const done = () => setGateDone(true);
    window.addEventListener(GATE_DONE_EVENT, done, { once: true });
    return () => window.removeEventListener(GATE_DONE_EVENT, done);
  }, []);

  useEffect(() => {
    if (reduced) return scale.jump(1);
    if (!inView || !gateDone) return;
    const timer = window.setTimeout(() => scale.set(1), delay * 1000);
    return () => window.clearTimeout(timer);
  }, [reduced, inView, gateDone, delay, scale]);

  // Swap to the on-marker text colour once the marker is past the middle of the phrase.
  useMotionValueEvent(scale, "change", (v) => setCovered(v > 0.6));

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <motion.span
        aria-hidden="true"
        className="marker-highlight absolute inset-y-0 -inset-x-[0.1em] rounded-[2px]"
        style={{ scaleX: scale, transformOrigin: "left center" }}
      />
      <span className="marker-highlight-text relative" data-covered={covered || reduced ? "" : undefined}>
        {children}
      </span>
    </span>
  );
}

// Renders a content string, highlighting any [[phrase]] inside it.
export function Marked({ text, delay }: { text: string; delay?: number }) {
  return text.split(/\[\[(.+?)\]\]/).map((part, i) =>
    i % 2 ? (
      <MarkerHighlight key={i} delay={delay}>
        {part}
      </MarkerHighlight>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default MarkerHighlight;
