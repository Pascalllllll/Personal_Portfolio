"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Accented } from "@/components/OsGate";

const FADE_MS = 500;
const HOLD_MS = 2000;

type Phase = "idle" | "showing" | "leaving";

// "View more" under the projects: the portfolio fades out, a full-screen message holds for 2s, then the
// portfolio fades back in. Nothing navigates or scrolls, so the visitor lands exactly where they were
// (and the music keeps playing). Escape returns early.
export default function ViewMore({ label, message }: { label: string; message: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const button = useRef<HTMLButtonElement>(null);
  const fade = useRef(FADE_MS);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) fade.current = 0;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (phase === "idle") return;

    if (phase === "showing") {
      root.classList.add("more-open");
      let timer = 0;
      const start = () => (timer = window.setTimeout(() => setPhase("leaving"), HOLD_MS));
      // The 2s start once the message is on screen (hidden tabs never fire rAF, so start straight away there).
      const frame = document.hidden ? (start(), 0) : requestAnimationFrame(start);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhase("leaving");
      window.addEventListener("keydown", onKey);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        window.removeEventListener("keydown", onKey);
      };
    }

    root.classList.remove("more-open");
    const timer = window.setTimeout(() => {
      setPhase("idle");
      button.current?.focus({ preventScroll: true });
    }, fade.current);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <>
      <div className="mt-10 flex justify-center">
        <button
          ref={button}
          type="button"
          onClick={() => phase === "idle" && setPhase("showing")}
          className="btn-outline"
        >
          {label}
        </button>
      </div>

      {phase !== "idle" &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            data-leaving={phase === "leaving" ? "" : undefined}
            className="more-screen fixed inset-0 z-[55] flex items-center justify-center px-4 sm:px-6"
          >
            <p className="os-gate-stage max-w-3xl text-balance text-center font-display text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              <Accented text={message} />
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
