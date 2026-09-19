"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { DuoButton } from "@/components/devhelp/duo-button";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };

export function DevHero() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <section className="relative overflow-hidden bg-duo-bg px-6 pb-16 pt-20 sm:pb-24 sm:pt-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(55%_55%_at_50%_0%,rgba(201,162,75,0.14),transparent)]"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="font-duo-body text-xs font-medium uppercase tracking-[0.25em] text-duo-ink/40"
        >
          Not another coding sandbox
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-5 font-duo-display text-4xl italic leading-[1.05] tracking-tight text-duo-ink sm:text-5xl md:text-6xl"
        >
          Learn on your real terminal.
          <br />
          Ship a real website.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="mt-6 max-w-lg font-duo-body text-base leading-relaxed text-duo-ink/55 sm:text-lg"
        >
          No browser sandbox, no account wall, no certificate at the end of a
          maze. Twelve lessons — verified commands, real explanations —
          finishing with a site you actually built and deployed yourself.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.24 }}
          className="mt-10"
        >
          <DuoButton href="/learn/terminal" color="green" size="lg" magnetic>
            Begin
          </DuoButton>
        </motion.div>
      </div>
    </section>
  );
}
