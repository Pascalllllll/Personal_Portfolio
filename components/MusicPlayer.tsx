"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";
import { content } from "@/lib/content";
import { GATE_DONE_EVENT } from "@/components/OsGate";

const SRC = "/music/misery.mp3";
// Counted from when the portfolio appears, not from page load (the OS gate may come first).
const AUTOPLAY_DELAY_MS = 5000;
const VOLUME = 0.3;

export default function MusicPlayer({ className }: { className: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const settledRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const t = content.nav;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onPause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const events = ["pointerdown", "keydown", "touchend"] as const;
    const removeUnlock = () => events.forEach((e) => window.removeEventListener(e, unlock));
    function unlock(e: Event) {
      removeUnlock();
      if (settledRef.current || buttonRef.current?.contains(e.target as Node)) return;
      settledRef.current = true;
      audio!.play().catch(() => {});
    }

    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (settledRef.current) return;
        audio.play().then(
          () => (settledRef.current = true),
          () => events.forEach((e) => window.addEventListener(e, unlock)),
        );
      }, AUTOPLAY_DELAY_MS);
    };

    if (document.documentElement.classList.contains("gate-open")) {
      window.addEventListener(GATE_DONE_EVENT, schedule, { once: true });
    } else {
      schedule();
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(GATE_DONE_EVENT, schedule);
      removeUnlock();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    settledRef.current = true;
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className={className}
        aria-label={playing ? t.pauseMusic : t.playMusic}
        aria-pressed={playing}
        title={playing ? t.pauseMusic : t.playMusic}
      >
        <Disc3
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className={playing ? "motion-safe:animate-[spin_3s_linear_infinite]" : undefined}
        />
      </button>
    </>
  );
}
