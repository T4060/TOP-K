"use client";

import { motion } from "framer-motion";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Shared ambient background: FlickeringGrid's per-square flicker plus a
 * slow whole-layer opacity pulse ("breathing"). A single canvas can't
 * literally bleed across sections without making bg-paper/bg-ink
 * transparent, which would undo the two-tone system — so this is applied
 * per-section instead, each tinted to that section's own tone, giving a
 * consistent "alive" technique across the layout without one section's
 * canvas showing through another's background.
 *
 * The pulse is infinite/indeterminate — no rest state for a spring to
 * resolve toward — so per rule 1's exception it stays a duration-based
 * tween rather than spring physics.
 */
export function AmbientCanvas({
  className,
  color,
  maxOpacity = 0.14,
  squareSize = 3,
  gridGap = 6,
  flickerChance = 0.12,
}: {
  className?: string;
  color: string;
  maxOpacity?: number;
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      animate={prefersReducedMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 7, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <FlickeringGrid
        className="h-full w-full"
        color={color}
        maxOpacity={maxOpacity}
        flickerChance={flickerChance}
        squareSize={squareSize}
        gridGap={gridGap}
      />
    </motion.div>
  );
}
