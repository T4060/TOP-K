"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/** Panel-level pan: the CLAUDE.md rule-1 default (100/15) — this track is
 * a large surface, so it stays weighted rather than snappy. */
const PAN_SPRING = { type: "spring", stiffness: 100, damping: 15 } as const;
/** Small-element tier from rule 1's tuning note, reused for card hover
 * lift and arrow-button press feedback. */
const HOVER_SPRING = { type: "spring", stiffness: 300, damping: 26 } as const;
/** Snappier tier for the arrow buttons — small, directly tracked, and
 * meant to feel immediate per rule 1's tuning note. */
const SNAP_SPRING = { type: "spring", stiffness: 420, damping: 26 } as const;
/** Pointer-tilt spring for dish-card hover. */
const TILT_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const TILT_DEGREES = 6;

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;

/** Unsplash-hosted photography, requested for end-to-end real data. This
 * sandbox's network policy blocks images.unsplash.com (confirmed via a 403
 * from the egress proxy — general web access is off by default here), so
 * these specific photo IDs could not be curl-verified before commit. They
 * are widely-used, high-confidence stable IDs, but Vercel's production
 * runtime (unrestricted network) is what will actually resolve them —
 * spot-check the deployed carousel and swap any that 404. */
const DISHES = [
  {
    course: "01",
    tag: "Smoke & brine",
    name: "Charred Octopus",
    description: "Smoked paprika, confit lemon, sea fennel.",
    price: "$28",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    course: "02",
    tag: "Raw intensity",
    name: "Wagyu Tartare",
    description: "Burnt onion, quail yolk, rye crisp.",
    price: "$34",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
  },
  {
    course: "03",
    tag: "Earth & citrus",
    name: "Heirloom Beet",
    description: "Whipped goat curd, pistachio, blood orange.",
    price: "$22",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
  },
  {
    course: "04",
    tag: "Umami depth",
    name: "Black Cod",
    description: "Miso glaze, shiso, charred scallion.",
    price: "$46",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  },
  {
    course: "05",
    tag: "Bittersweet",
    name: "Duck Breast",
    description: "Cherry gastrique, celeriac, juniper.",
    price: "$42",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
  },
  {
    course: "06",
    tag: "Quiet indulgence",
    name: "Dark Chocolate",
    description: "Olive oil, sea salt, brioche crumb.",
    price: "$18",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  },
] as const;

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={SNAP_SPRING}
      aria-label={direction === "left" ? "Previous dish" : "Next dish"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors duration-200 hover:border-paper/40 hover:bg-paper/10"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={direction === "right" ? "rotate-180" : undefined}
      >
        <path
          d="M10 3L5 8l5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

function DishCard({
  dish,
  index,
}: {
  dish: (typeof DISHES)[number];
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : PAN_SPRING;

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
      transition={{
        opacity: { ...entrance, delay: index * 0.06 },
        y: { ...entrance, delay: index * 0.06 },
        scale: prefersReducedMotion ? { duration: 0 } : HOVER_SPRING,
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
      className="group relative h-[440px] w-[300px] shrink-0 overflow-hidden rounded-3xl border border-paper/10 transition-colors duration-200 hover:border-paper/25"
    >
      <Image
        src={dish.image}
        alt={`${dish.name} — ${dish.description}`}
        fill
        sizes="300px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        priority={index === 0}
      />
      {/* Scrim so the overlaid text stays legible over the photo, per the
       * Figma reference's photo-card composition. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-15% via-ink/70 via-45% to-transparent to-80%" />

      <div className="relative flex h-full flex-col justify-between p-7">
        <span className="font-sans text-xs tracking-[0.2em] text-paper/40">
          {dish.course}
        </span>
        <div>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-paper/50">
            {dish.tag}
          </span>
          <h3 className="mt-2 font-display text-[2rem] italic leading-[1.05] tracking-tight text-paper">
            {dish.name}
          </h3>
          <p className="mt-3 font-sans text-xs leading-relaxed text-paper/60">
            {dish.description}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-paper/15 pt-4">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-paper/40">
              Tasting menu
            </span>
            <span className="font-sans text-sm text-paper/80">
              {dish.price}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MenuCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    function measure() {
      if (trackRef.current && viewportRef.current) {
        setMaxDrag(
          Math.max(
            0,
            trackRef.current.scrollWidth - viewportRef.current.offsetWidth
          )
        );
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function pan(direction: 1 | -1) {
    const next = Math.min(0, Math.max(-maxDrag, x.get() - direction * STEP));
    animate(x, next, prefersReducedMotion ? { duration: 0 } : PAN_SPRING);
  }

  return (
    <section id="menu" className="relative scroll-mt-24 bg-ink px-6 pb-32 pt-8 text-paper">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={prefersReducedMotion ? { duration: 0 } : PAN_SPRING}
              className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/40"
            >
              Tasting menu
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                ...(prefersReducedMotion ? { duration: 0 } : PAN_SPRING),
                delay: prefersReducedMotion ? 0 : 0.08,
              }}
              className="mt-4 max-w-xl font-display text-4xl italic leading-[1.1] tracking-tight sm:text-5xl"
            >
              A menu, considered.
            </motion.h2>
          </div>
          <div className="hidden shrink-0 gap-3 md:flex">
            <ArrowButton direction="left" onClick={() => pan(-1)} />
            <ArrowButton direction="right" onClick={() => pan(1)} />
          </div>
        </div>

        <div
          ref={viewportRef}
          aria-label="Tasting menu carousel"
          className="relative mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.12}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            style={{ x }}
            className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
          >
            {DISHES.map((dish, index) => (
              <DishCard key={dish.name} dish={dish} index={index} />
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center gap-3 md:hidden">
          <ArrowButton direction="left" onClick={() => pan(-1)} />
          <ArrowButton direction="right" onClick={() => pan(1)} />
        </div>
      </div>

      {/* Decorative flourish beneath the strip, echoing the flowing vector
       * under the Figma reference's card row. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full opacity-40"
      >
        <path
          d="M0 40 C 200 120, 400 0, 600 60 S 1000 140, 1200 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-paper/20"
        />
      </svg>
    </section>
  );
}
