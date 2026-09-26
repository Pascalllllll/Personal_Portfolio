"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 80;
const DELETE_MS = 40;
const HOLD_MS = 1800;
const HOLD_NAME_MS = 3500;

function Phrase({ text }: { text: string }) {
  if (!text.endsWith(".")) return <>{text}</>;
  return (
    <>
      {text.slice(0, -1)}
      <span className="stop">.</span>
    </>
  );
}

export default function TypingName({ name, phrases }: { name: string; phrases: readonly string[] }) {
  const all = [`${name}.`, ...phrases];
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(all[0].length);
  const [deleting, setDeleting] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const current = all[index];

  useEffect(() => {
    if (!animate) return;
    let delay: number;
    let step: () => void;

    if (!deleting && length === current.length) {
      delay = index === 0 ? HOLD_NAME_MS : HOLD_MS;
      step = () => setDeleting(true);
    } else if (deleting && length === 0) {
      delay = TYPE_MS * 3;
      step = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % all.length);
      };
    } else {
      delay = deleting ? DELETE_MS : TYPE_MS;
      step = () => setLength((n) => n + (deleting ? -1 : 1));
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [animate, deleting, length, index, current.length, all.length]);

  return (
    <>
      <span className="sr-only">{name}</span>
      <span className="grid" aria-hidden="true">
        {all.map((p) => (
          <span key={p} className="invisible col-start-1 row-start-1">
            {p}
          </span>
        ))}
        <span className="col-start-1 row-start-1">
          <Phrase text={current.slice(0, length)} />
          {animate && <span className="caret" />}
        </span>
      </span>
    </>
  );
}
