"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { MagneticButton } from "@/components/magnetic-button";

const SPRING = { type: "spring", stiffness: 100, damping: 15 } as const;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-paper">
      <FlickeringGrid
        className="absolute inset-0 z-0 [mask-image:radial-gradient(80%_60%_at_50%_40%,white,transparent)]"
        color="#0a0a0a"
        maxOpacity={0.18}
        flickerChance={0.12}
        squareSize={3}
        gridGap={6}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60"
        >
          Introducing TOP-K
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-6 font-display text-6xl italic leading-[1.05] tracking-tight text-ink sm:text-7xl md:text-8xl"
        >
          Precision, at scale.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink/70"
        >
          A refined foundation for building interfaces that feel considered
          — every motion tuned, every pixel deliberate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.24 }}
          className="mt-10"
        >
          <MagneticButton href="#get-started">Get started</MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
