"use client";

import type { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Pointer-tilt spring — snappy per rule 1's tuning note since it's
 * tracking the cursor directly. */
const TILT_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const TILT_DEGREES = 8;

/** Entrance spring: default per CLAUDE.md rule 1 — these are card-sized
 * surfaces, so they stay on 100/15 rather than the stiffer hover tuning. */
const ENTRANCE_SPRING: Transition = { type: "spring", stiffness: 100, damping: 15 };
/** Hover spring: stiffer per rule 1's tuning note for small, immediate
 * feedback (matches the magnetic button / navbar dropdown snappy tier). */
const HOVER_SPRING: Transition = { type: "spring", stiffness: 300, damping: 26 };

const FEATURES = [
  {
    eyebrow: "01",
    title: "Motion",
    description:
      "Every transition is driven by a tuned spring, never a linear ease, so motion resolves the way physical objects do.",
    featured: true,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    eyebrow: "02",
    title: "Interaction",
    description:
      "Primary actions pull toward the cursor and settle on the same spring language used everywhere else.",
    featured: false,
    span: "",
  },
  {
    eyebrow: "03",
    title: "Typography",
    description:
      "A serif display face carries every headline; a neutral sans handles body copy and UI chrome. Nothing else.",
    featured: false,
    span: "",
  },
  {
    eyebrow: "04",
    title: "Color",
    description:
      "Two tones, ink and paper, inverted by section — never a third color competing for attention.",
    featured: false,
    span: "",
  },
  {
    eyebrow: "05",
    title: "Layout",
    description:
      "Tight spacing, deliberate negative space, no ad hoc margins.",
    featured: false,
    span: "md:col-span-2",
  },
] as const;

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING;
  const hover = prefersReducedMotion ? { duration: 0 } : HOVER_SPRING;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, TILT_SPRING);
  const springRotateY = useSpring(rotateY, TILT_SPRING);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * TILT_DEGREES);
    rotateX.set(relY * -TILT_DEGREES);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      id={feature.title.toLowerCase()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      transition={{
        opacity: { ...entrance, delay: index * 0.08 },
        y: { ...entrance, delay: index * 0.08 },
        scale: hover,
      }}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 800,
            }
      }
      className={cn(
        "group relative flex scroll-mt-24 flex-col justify-between overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.03] p-8 transition-colors duration-200 hover:border-paper/20 hover:bg-paper/[0.05]",
        feature.span
      )}
    >
      <span className="font-sans text-xs tracking-[0.2em] text-paper/40">
        {feature.eyebrow}
      </span>
      <div className="mt-auto">
        <h3
          className={cn(
            "font-display italic text-paper",
            feature.featured ? "text-3xl" : "text-xl"
          )}
        >
          {feature.title}
        </h3>
        <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-paper/60">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureGrid() {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING;

  return (
    <section className="relative bg-ink px-6 py-32 text-paper">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entrance}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/40"
        >
          The system
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...entrance, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-4 max-w-xl font-display text-4xl italic leading-[1.1] tracking-tight sm:text-5xl"
        >
          Built on first principles.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[180px]">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
