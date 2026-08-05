"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  "TOP-K",
  "PRECISION, AT SCALE",
  "TASTING MENU",
  "RESERVATIONS OPEN",
  "EVERY MOTION TUNED",
] as const;

function Track({ decorative = false }: { decorative?: boolean }) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {ITEMS.map((item, index) => (
        <span key={index} className="flex items-center gap-8">
          <span className="font-display text-2xl italic text-ink/80 sm:text-3xl">
            {item}
          </span>
          <span aria-hidden="true" className="text-ink/20">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="marquee"
      aria-label="TOP-K, precision at scale, tasting menu, reservations open, every motion tuned"
      className="relative overflow-hidden border-y border-ink/10 bg-paper py-6"
    >
      <div
        className={cn(
          "flex w-max",
          !prefersReducedMotion &&
            "animate-marquee hover:[animation-play-state:paused]"
        )}
      >
        <Track />
        <Track decorative />
      </div>
    </div>
  );
}
