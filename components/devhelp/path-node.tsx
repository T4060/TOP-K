"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const POP_SPRING: Transition = { type: "spring", stiffness: 220, damping: 18 };
const PULSE: Transition = { type: "spring", stiffness: 120, damping: 6 };

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10" width="14" height="10" rx="2.5" fill="#AFAFAF" />
      <path
        d="M8 10V7a4 4 0 018 0v3"
        stroke="#AFAFAF"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function CheckBadge() {
  return (
    <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-duo-gold">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 7.5l3 3 6-6.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const COLOR_FACE: Record<string, string> = {
  green: "bg-duo-green border-duo-green-dark",
  blue: "bg-duo-blue border-duo-blue-dark",
  gold: "bg-duo-gold border-duo-gold-dark",
  red: "bg-duo-red border-duo-red-dark",
  purple: "bg-duo-purple border-duo-purple-dark",
};

export function PathNode({
  id,
  icon,
  label,
  color,
  x,
  y,
  index,
  status,
}: {
  id: string;
  icon: string;
  label: string;
  color: keyof typeof COLOR_FACE;
  x: number;
  y: number;
  index: number;
  status: "locked" | "current" | "complete";
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ ...POP_SPRING, delay: prefersReducedMotion ? 0 : index * 0.1 }}
      className="absolute flex -translate-x-1/2 flex-col items-center"
      style={{ left: `calc(50% + ${x}px)`, top: y }}
    >
      {status === "current" && !prefersReducedMotion && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...POP_SPRING }}
          className="mb-2 rounded-xl border-2 border-duo-track bg-white px-3 py-1 font-duo-display text-xs font-extrabold uppercase tracking-wide text-duo-green"
        >
          Start
        </motion.span>
      )}

      <motion.div
        animate={
          status === "current" && !prefersReducedMotion ? { scale: [1, 1.08, 1] } : undefined
        }
        transition={status === "current" ? { ...PULSE, repeat: Infinity } : undefined}
        className="relative"
      >
        {status === "locked" ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-duo-track bg-[#F0F0F0]">
            <LockIcon />
          </div>
        ) : (
          <Link href={`/learn/terminal?ask=${id}`} aria-label={label}>
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
              transition={POP_SPRING}
              className={cn(
                "flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-4 text-3xl shadow-[0_5px_0_rgba(0,0,0,0.12)]",
                COLOR_FACE[color]
              )}
            >
              {icon}
            </motion.div>
            {status === "complete" && <CheckBadge />}
          </Link>
        )}
      </motion.div>

      <span
        className={cn(
          "mt-3 max-w-[7rem] text-center font-duo-body text-xs font-bold",
          status === "locked" ? "text-duo-ink/40" : "text-duo-ink/70"
        )}
      >
        {label}
      </span>
    </motion.div>
  );
}
