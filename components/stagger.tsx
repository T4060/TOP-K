"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Fluid layout tier — CLAUDE.md rule 1's 340/30 named tier. */
const FLUID_SPRING = { type: "spring", stiffness: 340, damping: 30 } as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { scale: 0.94, y: 24 },
  show: { scale: 1, y: 0, transition: FLUID_SPRING },
};

/**
 * Master stagger wrapper: section entrances scale + glide up rather than
 * fade, on the 340/30 fluid-layout spring, staggered across children via
 * Framer Motion's own staggerChildren rather than manual index * delay
 * math. Settles well under rule 6's 400ms ceiling.
 */
export function Stagger({
  children,
  className,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
