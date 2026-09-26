"use client";

import { useEffect, useRef, useState } from "react";

// Must match the inline script in app/layout.tsx.
export const GATE_KEY = "os-gate-done";
// Fired on window when the gate hands off and the portfolio starts fading in.
export const GATE_DONE_EVENT = "os-gate-done";

const FADE_MS = 400;
const LEAVE_MS = 600;
const DENIED_MS = 3000;
const COOL_MS = 2000;
const KIDDING_MS = 1500;

type Phase = "choose" | "denied" | "kidding" | "cool" | "leave" | "done";

const OPTIONS = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "MacOS" },
  { id: "linux", label: "Linux" },
] as const;

const MESSAGES: Partial<Record<Phase, string>> = {
  denied: "Sorry, you are not eligible to visit this website.",
  kidding: "Just Kidding XD",
  cool: "Cool..",
};

// Trailing punctuation takes the accent, like the section heading full stops.
export function Accented({ text }: { text: string }) {
  const [, body, mark] = text.match(/^(.*?)([.?…]*)$/) ?? [, text, ""];
  return (
    <>
      {body}
      {mark && <span className="stop">{mark}</span>}
    </>
  );
}

export default function OsGate() {
  const [phase, setPhase] = useState<Phase>("choose");
  const [exiting, setExiting] = useState(false);
  const locked = useRef(false);
  const fade = useRef(FADE_MS);
  const shown = useRef<Phase>("choose");

  useEffect(() => {
    if (!document.documentElement.classList.contains("gate-open")) {
      setPhase("done");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) fade.current = 0;
  }, []);

  // Timers start one frame after the phase's screen has been committed and painted.
  useEffect(() => {
    let timer = 0;
    const after = (ms: number, fn: () => void) => {
      const start = () => {
        timer = window.setTimeout(fn, ms);
      };
      // Hidden tabs never fire rAF, so start straight away there instead of stalling.
      let frame = 0;
      if (document.hidden) start();
      else frame = requestAnimationFrame(start);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    };

    const swapTo = (next: Phase) => {
      setExiting(true);
      timer = window.setTimeout(() => {
        setPhase(next);
        setExiting(false);
      }, fade.current);
    };

    switch (phase) {
      case "denied":
        return after(DENIED_MS, () => swapTo("kidding"));
      case "kidding":
        return after(KIDDING_MS, () => setPhase("leave"));
      case "cool":
        return after(COOL_MS, () => setPhase("leave"));
      case "leave": {
        try {
          sessionStorage.setItem(GATE_KEY, "1");
        } catch {}
        document.documentElement.classList.remove("gate-open");
        window.dispatchEvent(new Event(GATE_DONE_EVENT));
        timer = window.setTimeout(() => setPhase("done"), fade.current && LEAVE_MS);
        return () => window.clearTimeout(timer);
      }
    }
  }, [phase]);

  if (phase === "done") return null;

  const choose = (os: (typeof OPTIONS)[number]["id"]) => {
    if (locked.current) return;
    locked.current = true;
    setExiting(true);
    window.setTimeout(() => {
      setPhase(os === "linux" ? "cool" : "denied");
      setExiting(false);
    }, fade.current);
  };

  // "leave" keeps the last message on screen while the gate fades out.
  if (MESSAGES[phase]) shown.current = phase;
  const message = MESSAGES[shown.current];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="os-gate-title"
      data-leaving={phase === "leave" ? "" : undefined}
      className="os-gate fixed inset-0 z-[55] flex items-center justify-center px-4 sm:px-6"
    >
      {phase === "choose" ? (
        <div key="choose" data-exiting={exiting ? "" : undefined} className="os-gate-stage w-full max-w-3xl text-center">
          <h2 id="os-gate-title" className="text-balance font-display text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            <Accented text="What is your Operating System?" />
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                className="os-gate-option btn-outline sm:min-w-32"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p
          key={shown.current}
          id="os-gate-title"
          aria-live="polite"
          data-exiting={exiting ? "" : undefined}
          className="os-gate-stage max-w-3xl text-balance text-center font-display text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink"
        >
          {message && <Accented text={message} />}
        </p>
      )}
    </div>
  );
}
