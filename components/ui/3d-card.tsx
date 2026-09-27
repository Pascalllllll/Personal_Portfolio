"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const TILT = 6; // degrees at the card edge
const springConfig = { damping: 15, stiffness: 150 };

/** Tilts toward the pointer in 3D. Mouse only: touch and reduced motion keep it flat. */
export function Card3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], [`${TILT}deg`, `-${TILT}deg`]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [`-${TILT}deg`, `${TILT}deg`]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const reset = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="h-full [perspective:1000px]">
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("card3d h-full", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** A slice of the card that lifts toward the viewer by `depth` px while the card is hovered (flat at rest). */
export function Card3DLayer({
  depth,
  children,
  className,
}: {
  depth: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("card3d-layer", className)}
      style={{ "--card3d-depth": `${depth}px`, transformStyle: "preserve-3d" } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
