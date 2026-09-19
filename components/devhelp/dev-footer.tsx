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
      className="border-t-2 border-duo-track bg-white px-6 py-10"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="font-duo-display text-lg font-extrabold text-duo-green">cmdline</p>
        <div className="flex items-center gap-6 font-duo-body text-sm font-bold text-duo-ink/50">
          <Link href="/learn" className="transition-colors duration-200 hover:text-duo-ink">
            Path
          </Link>
          <Link
            href="/learn/terminal"
            className="transition-colors duration-200 hover:text-duo-ink"
          >
            Lesson
          </Link>
          <Link href="/" className="transition-colors duration-200 hover:text-duo-ink">
            TOP-K ↗
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}
