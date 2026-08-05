"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/** Snappy interaction tier — CLAUDE.md rule 1's 280/18 named tier. */
const SNAP_SPRING = { type: "spring", stiffness: 280, damping: 18 } as const;

/**
 * Primary CTA per CLAUDE.md rule 2: pulls toward the cursor within a
 * bounded radius, springs back to rest on leave. Driven by `translate`
 * only (rule 3) via a spring (rule 1) — the 280/18 snap tier since a
 * small tracked element reads better crisp.
 */
const SIZE_STYLES = {
  default: "px-8 py-4 text-sm",
  sm: "px-5 py-2.5 text-xs",
} as const;

export function MagneticButton({
  children,
  className,
  href = "#",
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  size?: keyof typeof SIZE_STYLES;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SNAP_SPRING);
  const springY = useSpring(y, SNAP_SPRING);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionLink
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={SNAP_SPRING}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-ink font-sans font-medium tracking-wide text-paper transition-colors duration-200 hover:bg-ink/90",
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </MotionLink>
  );
}
