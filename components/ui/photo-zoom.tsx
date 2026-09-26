"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import React from "react";

type PhotoZoomProps = {
  children: React.ReactNode;
  src: string;
  size?: number;
  className?: string;
};

// Same card and motion as LinkPreview, for an image that isn't a link.
// Mouse only: the zoom is the same photo, so keyboard and touch users lose nothing.
export const PhotoZoom = ({ children, src, size = 240, className }: PhotoZoomProps) => {
  const reduced = useReducedMotion();
  const [isOpen, setOpen] = React.useState(false);

  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) / 2);
  };

  return (
    <HoverCardPrimitive.Root openDelay={80} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardPrimitive.Trigger asChild>
        <div onMouseMove={handleMouseMove} className={className}>
          {children}
        </div>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal forceMount>
        <HoverCardPrimitive.Content
          forceMount
          side="top"
          align="center"
          sideOffset={10}
          className="pointer-events-none z-40 [transform-origin:var(--radix-hover-card-content-transform-origin)]"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ x: translateX }}
                aria-hidden="true"
                className="rounded-lg border border-line bg-raised p-1 shadow-[0_8px_24px_rgb(0_0_0/0.18)]"
              >
                <span className="relative block overflow-hidden rounded-md bg-tag" style={{ width: size, height: size }}>
                  <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
};
