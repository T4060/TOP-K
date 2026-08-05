"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/**
 * Soft cursor-follow glow, site-wide. Ink and paper are both near the
 * extremes of the grayscale range (#0a0a0a / #fafaf9), so a `difference`
 * blend using either of them collapses to near-zero contrast against its
 * own section (ink-on-ink cancels to black, paper-on-paper stays
 * near-white). A mid-gray blob — still achromatic, no hue introduced —
 * differences visibly against both, which is what actually makes the
 * effect readable while staying inside CLAUDE.md's two-tone rule.
 * Desktop pointer only; skipped for touch and reduced motion.
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
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[420px] w-[420px] rounded-full bg-[#8a8a8a] mix-blend-difference blur-[100px] md:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
