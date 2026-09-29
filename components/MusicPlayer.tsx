"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";
import { content } from "@/lib/content";

const SRC = "/music/misery.mp3";
const VOLUME = 0.15;

export default function MusicPlayer({ className }: { className: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
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

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
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
