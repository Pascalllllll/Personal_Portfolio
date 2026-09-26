"use client";

import { useEffect, useRef } from "react";

const RAYS = 7;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function ClickBurst() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || reduced.matches || !layer.current) return;

      const sector = 360 / RAYS;
      const start = rand(0, 360);

      for (let i = 0; i < RAYS; i++) {
        const angle = start + i * sector + rand(-sector * 0.3, sector * 0.3);
        const tilt = rand(-4, 4);
        const length = rand(10, 26);
        const r0 = rand(4, 10);
        const travel = rand(22, 48);

        const bar = document.createElement("span");
        bar.className = "click-burst-bar";
        bar.style.left = `${e.clientX}px`;
        bar.style.top = `${e.clientY - 1}px`;
        bar.style.width = `${length}px`;

        const at = (r: number) => `rotate(${angle}deg) translateX(${r}px) rotate(${tilt}deg)`;
        const peak = rand(0.7, 1);

        const timing = { duration: rand(420, 640), delay: rand(0, 60), fill: "both" as const };

        layer.current.appendChild(bar);
        bar.animate([{ transform: at(r0) }, { transform: at(r0 + travel) }], {
          ...timing,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
        bar
          .animate([{ opacity: peak }, { opacity: peak, offset: 0.5 }, { opacity: 0 }], {
            ...timing,
            easing: "ease-in",
          })
          .finished.then(() => bar.remove(), () => bar.remove());
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" />;
}
