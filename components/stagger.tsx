"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** High-velocity default, per explicit direction. */
const SNAP_SPRING = { type: "spring", stiffness: 220, damping: 20 } as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { scale: 0.94, y: 24 },
  show: { scale: 1, y: 0, transition: SNAP_SPRING },
};

/**
 * Master stagger wrapper: section entrances scale + glide up rather than
 * fade, on the 220/20 spring, staggered across children via Framer
 * Motion's own staggerChildren rather than manual index * delay math.
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
