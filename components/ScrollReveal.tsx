"use client";

import { useEffect } from "react";

// Fades [data-reveal] elements in as they enter the viewport and out as they leave, in both scroll directions.
// Elements leaving past the top drift up, elements below the fold wait lower down, so motion follows the scroll.
// The html.reveal class is set by an inline script in the layout before first paint; without it (no JS or
// reduced motion) everything simply stays visible.
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
      // Elements count as visible inside the middle of the screen, so they fade before touching the edges.
      { rootMargin: "-8% 0px -8% 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
