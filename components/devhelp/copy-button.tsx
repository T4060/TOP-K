"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const HOVER = { type: "spring", stiffness: 300, damping: 26 } as const;

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 9.5v-6A1 1 0 013.5 2.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : HOVER;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — button just stays in its default state.
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
      transition={transition}
      aria-label={copied ? "Copied" : "Copy command"}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
        copied
          ? "border-duo-green/50 bg-duo-green/15 text-duo-green"
          : "border-white/15 text-white/50 hover:border-white/30 hover:bg-white/5 hover:text-white/80"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={transition}
          className="flex items-center justify-center"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
