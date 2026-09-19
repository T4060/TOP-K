"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };

const DIFFERENTIATORS = [
  {
    emoji: "🖥️",
    color: "bg-duo-green/10 text-duo-green",
    title: "Your real terminal",
    description:
      "Every command runs where you actually work — not a sandbox that stops meaning anything the moment you close the tab.",
  },
  {
    emoji: "🔑",
    color: "bg-duo-blue/15 text-duo-blue",
    title: "No account, no paywall",
    description:
      "Progress lives in your browser. No signup wall, no subscription gate halfway through the path.",
  },
  {
    emoji: "🏆",
    color: "bg-duo-gold/15 text-duo-gold",
    title: "You keep what you build",
    description:
      "The path ends with a real, deployed website — not a certificate. An actual project with your name on it.",
  },
] as const;

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <section id="how-it-works" className="bg-duo-bg px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entrance}
          className="text-center font-duo-body text-xs font-medium uppercase tracking-[0.25em] text-duo-ink/40"
        >
          Built differently, on purpose
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...entrance, delay: prefersReducedMotion ? 0 : 0.06 }}
          className="mt-3 text-center font-duo-display text-4xl italic tracking-tight text-duo-ink sm:text-5xl"
        >
          What every competitor skips.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {DIFFERENTIATORS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ ...entrance, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl ${item.color}`}
              >
                {item.emoji}
              </span>
              <h3 className="mt-5 font-duo-display text-xl italic text-duo-ink">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs font-duo-body text-sm leading-relaxed text-duo-ink/55">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
