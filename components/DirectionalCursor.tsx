"use client";

import { useEffect, useRef } from "react";

const TIP = 2;
const REST_ANGLE = -135;
const MIN_TRAVEL = 6;
const TURN_MS = 70;

const INTERACTIVE = "a, button, [role='button'], label, select, summary";
const NATIVE =
  "textarea, [contenteditable=''], [contenteditable='true'], :disabled, " +
  "input:not([type='button'],[type='submit'],[type='reset'],[type='checkbox'],[type='radio'],[type='range'],[type='color'],[type='file'])";

const turn = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

export default function DirectionalCursor() {
  const arrow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = arrow.current;
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el) return;

    let x = 0;
    let y = 0;
    let anchorX = 0;
    let anchorY = 0;
    let angle = 0;
    let target = 0;
    let frame = 0;
    let last = 0;

    const render = () => {
      el.style.transform = `translate3d(${x - TIP}px, ${y - TIP}px, 0) rotate(${angle}deg)`;
    };

    const tick = (now: number) => {
      const dt = last ? now - last : 16;
      last = now;
      const diff = turn(angle, target);
      angle += diff * (1 - Math.exp(-dt / TURN_MS));
      if (Math.abs(diff) < 0.1) {
        angle = target;
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      render();
    };

    const enable = () => {
      root.classList.add("custom-cursor");
      el.dataset.visible = "";
    };

    const disable = () => {
      root.classList.remove("custom-cursor");
      delete el.dataset.visible;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !finePointer.matches) {
        disable();
        return;
      }
      if (!root.classList.contains("custom-cursor")) {
        anchorX = e.clientX;
        anchorY = e.clientY;
        enable();
      }

      x = e.clientX;
      y = e.clientY;

      const targetEl = e.target instanceof Element ? e.target : null;
      el.dataset.native = targetEl?.closest(NATIVE) ? "true" : "false";
      el.dataset.hover = targetEl?.closest(INTERACTIVE) ? "true" : "false";

      const dx = x - anchorX;
      const dy = y - anchorY;
      if (!reduced.matches && dx * dx + dy * dy >= MIN_TRAVEL * MIN_TRAVEL) {
        target = (Math.atan2(dy, dx) * 180) / Math.PI - REST_ANGLE;
        anchorX = x;
        anchorY = y;
        if (!frame) frame = requestAnimationFrame(tick);
      }
      render();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) delete el.dataset.visible;
    };

    const onMouseOver = () => {
      if (root.classList.contains("custom-cursor")) el.dataset.visible = "";
    };

    const onReducedChange = () => {
      if (reduced.matches) {
        target = angle = 0;
        render();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseover", onMouseOver);
    reduced.addEventListener("change", onReducedChange);
    finePointer.addEventListener("change", disable);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseover", onMouseOver);
      reduced.removeEventListener("change", onReducedChange);
      finePointer.removeEventListener("change", disable);
      disable();
    };
  }, []);

  return (
    <div ref={arrow} aria-hidden="true" className="directional-cursor">
      <svg width="22" height="22" viewBox="0 0 22 22">
        <path d="M2 2 L19 9.6 L12.2 12.2 L9.6 19 Z" />
      </svg>
    </div>
  );
}
