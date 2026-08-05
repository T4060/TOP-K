"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AmbientCanvas } from "@/components/ambient-canvas";
import { MagneticButton } from "@/components/magnetic-button";
import { Stagger, StaggerItem } from "@/components/stagger";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Snappy interaction tier — CLAUDE.md rule 1's 500/30 named tier. */
const SNAP_SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;

/**
 * Full-bleed cursor-tracking light. Gold per CLAUDE.md rule 2's permanent
 * premium exception to the two-color restraint — deliberately exempt from
 * the 340/30 / 500/30 hardened tiers too: a soft, high-mass spring so the
 * light trails the pointer with visible inertia rather than snapping.
 * That lag is the intended luxury feel, not something to tune out.
 */
function GoldCursorGlow({
  x,
  y,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const glow = useMotionTemplate`radial-gradient(640px circle at ${x}px ${y}px, rgba(212,175,55,0.22), rgba(212,175,55,0.05) 42%, transparent 72%)`;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{ background: glow }}
    />
  );
}

/** Glass-like bento panel floating over the section's full-bleed grid —
 * no glow of its own now that the gold cursor light spans the whole
 * hero. */
function GlowTile({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.04] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

/** The hero headline gets its own immediate, non-scroll-gated entrance —
 * a spring-driven clip-path reveal so the line elegantly unmasks the
 * millisecond the page loads, rather than waiting on the shared stagger
 * used by the rest of the tile's copy. Bold sans per CLAUDE.md rule 4's
 * permanent premium exception to the serif-italic voice used everywhere
 * else. The reveal itself still uses the hardened snap tier — the
 * exception covers the typeface choice, not this animation's speed. */
function HeroHeadline({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.h1
      initial={
        prefersReducedMotion
          ? false
          : { clipPath: "inset(0 100% 0 0)", y: 12 }
      }
      animate={{ clipPath: "inset(0 0% 0 0)", y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : SNAP_SPRING}
      className="mt-6 font-sans text-6xl font-black leading-[0.9] tracking-tighter text-paper sm:text-7xl md:text-8xl"
    >
      Precision, at scale.
    </motion.h1>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /** Scroll parallax: the copy fades as the hero scrolls out, spring-
   * smoothed (rule 1) rather than tracking scroll position 1:1. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawContentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentOpacity = useSpring(rawContentOpacity, {
    stiffness: 60,
    damping: 20,
  });

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springGlowX = useSpring(glowX, { stiffness: 40, damping: 14, mass: 1.4 });
  const springGlowY = useSpring(glowY, { stiffness: 40, damping: 14, mass: 1.4 });

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-ink px-6 py-32 text-paper"
    >
      {/* Full-bleed kinetic grid — the 3-second hook's ambient backdrop. */}
      <AmbientCanvas
        className="absolute inset-0"
        color="#fafaf9"
        maxOpacity={0.07}
        flickerChance={0.12}
        squareSize={3}
        gridGap={6}
      />

      {!prefersReducedMotion && <GoldCursorGlow x={springGlowX} y={springGlowY} />}

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-20 mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[440px]"
      >
        <GlowTile className="flex flex-col justify-center p-10 md:col-span-2 md:p-14">
          <Stagger className="relative">
            <StaggerItem>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/60">
                Introducing TOP-K
              </p>
            </StaggerItem>

            <HeroHeadline prefersReducedMotion={prefersReducedMotion} />

            <StaggerItem>
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-paper/70">
                A refined foundation for building interfaces that feel
                considered — every motion tuned, every pixel deliberate.
              </p>
            </StaggerItem>

            <StaggerItem className="mt-10">
              <MagneticButton href="/reservations">Get started</MagneticButton>
            </StaggerItem>
          </Stagger>
        </GlowTile>

        <GlowTile className="hidden items-center justify-center md:flex">
          <span className="font-display text-4xl italic tracking-tighter text-paper/25">
            TOP-K
          </span>
        </GlowTile>
      </motion.div>
    </section>
  );
}
