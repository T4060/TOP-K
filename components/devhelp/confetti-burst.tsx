"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#C9A24B", "#E4C275", "#1F5C48", "#7A3B3B", "#F1EAD9"];

export function ConfettiBurst({ count = 28 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        angle: Math.random() * Math.PI * 2,
        distance: 70 + Math.random() * 150,
        rotate: (Math.random() - 0.5) * 720,
        width: 5 + Math.random() * 5,
        delay: Math.random() * 0.12,
      })),
    [count]
  );

  if (prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {particles.map((p) => {
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;
        return (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
            animate={{ opacity: 0, x, y: y + 130, rotate: p.rotate, scale: 1 }}
            transition={{ type: "spring", stiffness: 55, damping: 11, delay: p.delay }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: p.width,
              height: p.width * 2.4,
              background: p.color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
