"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";
import { content } from "@/lib/content";

const SRC = "/music/misery.mp3";
const AUTOPLAY_DELAY_MS = 3000;
// Background music sits under the page, not over it: well below full volume.
const VOLUME = 0.3;

export default function MusicPlayer({ className }: { className: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Set once playback has started or the visitor has used the button, so autoplay never overrides them.
  const settledRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const t = content.nav;

  // Keep the icon in sync if playback stops on its own, e.g. the file fails to load.
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
    // Browsers block sound until the visitor interacts with the page, so the first interaction starts it instead.
    // Clicks on the player itself are left to its own toggle.
    function unlock(e: Event) {
      removeUnlock();
      if (settledRef.current || buttonRef.current?.contains(e.target as Node)) return;
      settledRef.current = true;
      audio!.play().catch(() => {});
    }

    const timer = window.setTimeout(() => {
      if (settledRef.current) return;
      audio.play().then(
        () => (settledRef.current = true),
        () => events.forEach((e) => window.addEventListener(e, unlock)),
      );
    }, AUTOPLAY_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
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
      <audio ref={audioRef} src={SRC} loop preload="auto" />
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
