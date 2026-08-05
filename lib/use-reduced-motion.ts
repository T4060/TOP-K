"use client";

import { useEffect, useState } from "react";
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * SSR-safe wrapper around framer-motion's `useReducedMotion`. That hook
 * lazily reads `matchMedia` during the client's very first render (via a
 * `useState` initializer), which can disagree with the server's always-
 * false guess and trip a Next.js hydration mismatch for anyone with the
 * OS-level reduced-motion preference on. Deferring to the real value only
 * after mount keeps the first paint identical to SSR; the switch to
 * reduced motion then happens on a normal post-commit re-render instead of
 * during hydration itself.
 */
export function useReducedMotion(): boolean {
  const actual = useFramerReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(actual) : false;
}
