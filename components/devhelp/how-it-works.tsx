"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };

const STEPS = [
  {
    emoji: "🎯",
    color: "bg-duo-green/15 text-duo-green",
    title: "Pick a lesson",
    description: "Follow the path in order, or jump to whatever you're stuck on right now.",
  },
  {
    emoji: "👣",
    color: "bg-duo-blue/15 text-duo-blue",
    title: "One step at a time",
    description: "Each step is a single command and one reason for it — never a wall of text.",
  },
  {
    emoji: "🏆",
    color: "bg-duo-gold/20 text-duo-gold-dark",
    title: "Earn XP, build a streak",
    description: "Finish a lesson, copy the real command, watch your streak grow.",
  },
] as const;

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <section id="how-it-works" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entrance}
          className="text-center font-duo-display text-4xl font-extrabold tracking-tight text-duo-ink sm:text-5xl"
        >
          Learn like a game, ship like a dev.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ ...entrance, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${step.color}`}
              >
                {step.emoji}
              </span>
              <h3 className="mt-4 font-duo-display text-xl font-extrabold text-duo-ink">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs font-duo-body text-sm font-medium leading-relaxed text-duo-ink/60">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
