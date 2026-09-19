"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/devhelp/animated-number";

const POP_SPRING = { type: "spring", stiffness: 400, damping: 15 } as const;

function GemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h12l4 6-10 12L2 9l4-6z"
        fill="#1CB0F6"
        stroke="#1899D6"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" stroke="#8BDCFF" strokeWidth="0.6" />
    </svg>
  );
}

export function XPBadge({ xp }: { xp: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={xp}
      initial={prefersReducedMotion ? undefined : { scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={POP_SPRING}
      className="flex items-center gap-1.5 rounded-full border-2 border-duo-track bg-white px-3 py-1.5"
    >
      <GemIcon />
      <span className="font-duo-display text-sm font-extrabold text-duo-ink">
        <AnimatedNumber value={xp} /> XP
      </span>
    </motion.div>
  );
}
