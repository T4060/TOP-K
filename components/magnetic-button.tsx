"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Primary CTA per CLAUDE.md rule 2: pulls toward the cursor within a
 * bounded radius, springs back to rest on leave. Driven by `translate`
 * only (rule 3) via a spring (rule 1) — stiffer than the 100/15 default
 * since a small tracked element reads better snappy, per the tuning note
 * in rule 1.
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
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
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
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-ink font-sans font-medium tracking-wide text-paper transition-colors duration-200 hover:bg-ink/90",
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </motion.a>
  );
}
