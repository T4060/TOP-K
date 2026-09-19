"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ENTRANCE = { type: "spring", stiffness: 220, damping: 20 } as const;

export function DevFooter() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={transition}
      className="border-t border-ink/10 bg-paper px-6 py-12"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-lg italic text-ink">
            cmdline<span className="text-ink/40">/</span>
          </p>
          <p className="mt-1 font-sans text-sm text-ink/50">
            Built for the first hundred hours of learning to code.
          </p>
        </div>
        <div className="flex items-center gap-6 font-sans text-sm text-ink/60">
          <Link href="/learn" className="transition-colors duration-200 hover:text-ink">
            Home
          </Link>
          <Link
            href="/learn/terminal"
            className="transition-colors duration-200 hover:text-ink"
          >
            Terminal
          </Link>
          <Link href="/" className="transition-colors duration-200 hover:text-ink">
            TOP-K ↗
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
