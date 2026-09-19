"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Mascot } from "@/components/devhelp/mascot";
import { DuoButton } from "@/components/devhelp/duo-button";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };

export function DevHero() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <section className="relative overflow-hidden bg-white px-6 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-0 h-64 bg-[radial-gradient(60%_60%_at_50%_0%,#DDF4C8,transparent)]"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          <Mascot size={140} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.1 }}
          className="mt-6 font-duo-display text-4xl font-extrabold leading-tight tracking-tight text-duo-ink sm:text-5xl md:text-6xl"
        >
          Learn to code, <span className="text-duo-green">one command</span> at a time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.18 }}
          className="mt-4 max-w-lg font-duo-body text-base font-semibold text-duo-ink/60 sm:text-lg"
        >
          A gamified path through the terminal skills every beginner needs —
          real commands, one bite-sized lesson at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.26 }}
          className="mt-8"
        >
          <DuoButton href="/learn/terminal" color="green" size="lg" magnetic>
            Start learning
          </DuoButton>
        </motion.div>
      </div>
    </section>
  );
}
