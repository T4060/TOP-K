"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Soft cursor-follow glow, site-wide. Originally a `mix-blend-difference`
 * blob, which inverted unpredictably where it crossed the tasting-menu
 * cards' own stacked gradient layers (radial plate texture + scrim),
 * producing a glitchy banded look. Replaced with a plain radial-gradient
 * background — normal alpha compositing, no blend mode — so it only ever
 * adds a soft paper-toned highlight and can't invert or band against
 * whatever is underneath. Desktop pointer only; skipped for touch and
 * reduced motion.
 */
export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [prefersReducedMotion, x, y]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[420px] w-[420px] rounded-full md:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        backgroundImage:
          "radial-gradient(circle, rgba(250,250,249,0.22) 0%, rgba(250,250,249,0.08) 45%, rgba(250,250,249,0) 72%)",
      }}
    />
  );
}
