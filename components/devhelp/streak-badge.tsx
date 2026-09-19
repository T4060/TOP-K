"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/devhelp/animated-number";

const POP_SPRING = { type: "spring", stiffness: 400, damping: 15 } as const;

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c1 3-3 4-3 8a3 3 0 006 0c1 1 2 2.5 2 4.5A5.5 5.5 0 0111.5 20 6 6 0 015 14c0-5 4-7 4-10 1 1 2 2 3-2z"
        fill="#C9A24B"
        stroke="#A17F38"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StreakBadge({ streak }: { streak: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={streak}
      initial={prefersReducedMotion ? undefined : { scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={POP_SPRING}
      className="flex items-center gap-1.5 rounded-full border border-duo-track bg-duo-surface px-3 py-1.5"
    >
      <FlameIcon />
      <span className="font-duo-body text-sm font-semibold text-duo-ink">
        <AnimatedNumber value={streak} />
      </span>
    </motion.div>
  );
}
