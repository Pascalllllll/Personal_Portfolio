"use client";

import { useEffect } from "react";

// Scrolls to in-page sections without writing #section into the address bar.
export default function HashlessAnchors() {
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute("href")!.slice(1));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView();
      // Keyboard activation (detail 0) moves focus too, so the skip link and Tab order keep working.
      if (e.detail === 0) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
