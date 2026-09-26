"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("reveal")) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting, boundingClientRect, rootBounds } of entries) {
          const el = target as HTMLElement;
          if (isIntersecting) {
            el.dataset.shown = "";
          } else {
            delete el.dataset.shown;
            el.dataset.side = boundingClientRect.top < (rootBounds?.top ?? 0) ? "above" : "below";
          }
        }
      },
      { rootMargin: "-8% 0px -8% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
