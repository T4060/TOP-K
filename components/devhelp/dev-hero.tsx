"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { MagneticButton } from "@/components/magnetic-button";

/** Matches the site-wide crisp spring tier used across TOP-K's shared
 * primitives (rule 1), reused here for cross-product motion consistency. */
const SPRING = { type: "spring", stiffness: 220, damping: 20 } as const;

export function DevHero() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawGridY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const gridY = useSpring(rawGridY, { stiffness: 60, damping: 20 });
  const rawContentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentOpacity = useSpring(rawContentOpacity, {
    stiffness: 60,
    damping: 20,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-paper"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y: gridY }}
        className="absolute inset-0 z-0"
      >
        <FlickeringGrid
          className="h-full w-full [mask-image:radial-gradient(80%_60%_at_50%_40%,white,transparent)]"
          color="#0a0a0a"
          maxOpacity={0.18}
          flickerChance={0.12}
          squareSize={3}
          gridGap={6}
        />
      </motion.div>

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60"
        >
          A learning tool for new programmers
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-6 font-display text-6xl italic leading-[0.95] tracking-tighter text-ink sm:text-7xl md:text-8xl"
        >
          Type it. We&apos;ll walk you there.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-ink/70"
        >
          Say &ldquo;help me with this&rdquo; and describe what you&apos;re
          stuck on. cmdline turns it into exact, numbered commands — run
          straight in your terminal, no guessing which line does what.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.24 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="/learn/terminal">
            Help me with this...
          </MagneticButton>
          <span className="font-mono text-xs text-ink/40">
            no install &middot; no account &middot; just answers
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
