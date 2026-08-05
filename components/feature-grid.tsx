"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Transition,
} from "framer-motion";
import { AmbientCanvas } from "@/components/ambient-canvas";
import { Stagger, StaggerItem } from "@/components/stagger";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Pointer-tilt spring — snappy per rule 1's tuning note since it's
 * tracking the cursor directly. */
const TILT_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const TILT_DEGREES = 8;

/** High-velocity default, per explicit direction: replaces rule 1's
 * standard 100/15 panel tier with a crisper spring for entrance and
 * shared-layout transitions on this section. */
const ENTRANCE_SPRING: Transition = { type: "spring", stiffness: 220, damping: 20 };
/** Hover spring: stiffer per rule 1's tuning note for small, immediate
 * feedback (matches the magnetic button / navbar dropdown snappy tier). */
const HOVER_SPRING: Transition = { type: "spring", stiffness: 300, damping: 26 };
/** Shared-layout spring driving the click-to-expand card morph. */
const EXPAND_SPRING: Transition = { type: "spring", stiffness: 220, damping: 24 };

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

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FeatureCard({
  feature,
  index,
  isActive,
  onOpen,
  onClose,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING;
  const hover = prefersReducedMotion ? { duration: 0 } : HOVER_SPRING;
  const expandTransition = prefersReducedMotion ? { duration: 0 } : EXPAND_SPRING;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, TILT_SPRING);
  const springRotateY = useSpring(rotateY, TILT_SPRING);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || isActive) return;
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
      layoutId={`feature-card-${feature.title}`}
      layout
      id={feature.title.toLowerCase()}
      role={isActive ? "dialog" : undefined}
      aria-modal={isActive || undefined}
      aria-label={isActive ? feature.title : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isActive ? undefined : onOpen}
      initial={{ scale: 0.94, y: 24 }}
      whileInView={{ scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={
        prefersReducedMotion || isActive
          ? undefined
          : { scale: 1.02, transition: hover }
      }
      transition={{
        scale: { ...entrance, delay: index * 0.08 },
        y: { ...entrance, delay: index * 0.08 },
        layout: expandTransition,
      }}
      style={
        prefersReducedMotion || isActive
          ? undefined
          : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 800,
            }
      }
      className={cn(
        "group relative flex scroll-mt-24 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.03] p-8 transition-colors duration-200 hover:border-paper/20 hover:bg-paper/[0.05]",
        isActive
          ? "fixed inset-6 z-[70] cursor-default sm:inset-x-auto sm:inset-y-12 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2"
          : feature.span
      )}
    >
      {/* Dynamic, breathing canvas texture, not a static block. */}
      <AmbientCanvas
        className="absolute inset-0 [mask-image:radial-gradient(120%_90%_at_30%_20%,white,transparent)]"
        color="#fafaf9"
        maxOpacity={0.08}
        flickerChance={0.15}
        squareSize={2}
        gridGap={5}
      />
      <div className="absolute inset-0 bg-ink/10" />

      {isActive && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          whileTap={{ scale: 0.9 }}
          transition={HOVER_SPRING}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors duration-200 hover:border-paper/40 hover:bg-paper/10"
        >
          <CloseIcon />
        </motion.button>
      )}

      <span className="relative font-sans text-xs tracking-[0.2em] text-paper/40">
        {feature.eyebrow}
      </span>
      <div className="relative mt-auto">
        <h3
          className={cn(
            "font-display italic tracking-tight text-paper",
            isActive ? "text-4xl" : feature.featured ? "text-3xl" : "text-xl"
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-3 font-sans leading-relaxed text-paper/60",
            isActive ? "max-w-md text-base" : "max-w-xs text-sm"
          )}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureGrid() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTitle) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveTitle(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTitle]);

  return (
    <section className="relative bg-ink px-6 py-32 text-paper">
      <div className="mx-auto max-w-5xl">
        <Stagger>
          <StaggerItem>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/40">
              The system
            </p>
          </StaggerItem>
          <StaggerItem className="mt-4">
            <h2 className="max-w-xl font-display text-5xl italic leading-[1.02] tracking-tighter text-paper sm:text-6xl">
              Built on first principles.
            </h2>
          </StaggerItem>
        </Stagger>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[180px]">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isActive={activeTitle === feature.title}
              onOpen={() => setActiveTitle(feature.title)}
              onClose={() => setActiveTitle(null)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={() => setActiveTitle(null)}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
