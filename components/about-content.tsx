"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/magnetic-button";

const SPRING = { type: "spring", stiffness: 100, damping: 15 } as const;

export function AboutContent() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-paper px-6 py-40">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60"
        >
          About
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-6 font-display text-5xl italic leading-[1.1] tracking-tight text-ink sm:text-6xl"
        >
          A table, considered.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink/70"
        >
          TOP-K opened with one idea: that a kitchen and a dining room can be
          built with the same discipline as any well-made system — every
          course tuned, every detail deliberate. We source in small batches,
          change the tasting menu with the seasons, and keep the room quiet
          enough to hear the food.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.24 }}
          className="mt-10"
        >
          <MagneticButton href="/reservations">Reserve a table</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
