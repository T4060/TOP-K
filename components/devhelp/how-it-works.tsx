"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };

const STEPS = [
  {
    number: "01",
    title: "Say what you're stuck on",
    description:
      "“Help me push to GitHub”, “help me install Node” — plain language, no command syntax required.",
  },
  {
    number: "02",
    title: "Get numbered, exact steps",
    description:
      "Each step is one command and one reason for it — never a wall of text to decode.",
  },
  {
    number: "03",
    title: "Copy, paste, run",
    description:
      "Copy straight into your real terminal. Nothing here is simulated — every command is the real one.",
  },
] as const;

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <section id="how-it-works" className="bg-paper px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entrance}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/40"
        >
          How it works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...entrance, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-4 max-w-xl font-display text-5xl italic leading-[1.02] tracking-tighter text-ink sm:text-6xl"
        >
          No manuals. Just the next command.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ ...entrance, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            >
              <span className="font-mono text-xs text-ink/35">{step.number}</span>
              <h3 className="mt-3 font-display text-2xl italic tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink/60">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
