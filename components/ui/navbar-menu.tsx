"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** High-velocity default, per explicit direction: replaces rule 1's
 * standard 100/15 panel tier with a crisper spring site-wide. */
const DEFAULT_SPRING = { type: "spring", stiffness: 220, damping: 20 } as const;

export function Menu({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative flex items-center justify-center gap-8 rounded-full border border-ink/10 bg-paper/90 px-8 py-4 shadow-[0_1px_2px_rgba(10,10,10,0.04)] backdrop-blur",
        className
      )}
    >
      {children}
    </nav>
  );
}

export function MenuItem({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : DEFAULT_SPRING;

  return (
    <div
      onMouseEnter={() => setActive(item)}
      onFocus={() => setActive(item)}
      className="relative"
    >
      <button
        type="button"
        className="font-sans text-sm text-ink/80 transition-colors duration-200 hover:text-ink"
      >
        {item}
      </button>

      <AnimatePresence>
        {active === item && children && (
          <motion.div
            layoutId="navbar-dropdown"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={transition}
            className="absolute left-1/2 top-[calc(100%+1rem)] w-max -translate-x-1/2 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-xl"
          >
            <motion.div layout className="p-5">
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HoveredLink({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "font-sans text-sm text-ink/70 transition-colors duration-200 hover:text-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}
