"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { AmbientCanvas } from "@/components/ambient-canvas";
import { MagneticButton } from "@/components/magnetic-button";
import { Stagger, StaggerItem } from "@/components/stagger";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Cursor-tracked radial glow, scoped to this hero's own bento tiles only
 * (not a site-wide cursor effect — that was tried and explicitly removed
 * earlier). Spring-smoothed position rather than tracking the pointer
 * 1:1, so the glow drifts rather than snaps. */
function GlowTile({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const springX = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(my, { stiffness: 120, damping: 20, mass: 0.5 });
  const glow = useMotionTemplate`radial-gradient(480px circle at ${springX}% ${springY}%, rgba(250,250,249,0.16), transparent 70%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.03]",
        className
      )}
    >
      <AmbientCanvas
        className="absolute inset-0 [mask-image:radial-gradient(90%_80%_at_50%_30%,white,transparent)]"
        color="#fafaf9"
        maxOpacity={0.1}
        squareSize={3}
        gridGap={6}
      />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glow }}
        />
      )}
      {children}
    </div>
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

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-ink px-6 py-32 text-paper"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[440px]"
      >
        <GlowTile className="flex flex-col justify-center p-10 md:col-span-2 md:p-14">
          <Stagger className="relative">
            <StaggerItem>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/60">
                Introducing TOP-K
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="mt-6 font-display text-6xl italic leading-[0.95] tracking-tighter text-paper sm:text-7xl md:text-8xl">
                Precision, at scale.
              </h1>
            </StaggerItem>

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
