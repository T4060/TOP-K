"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";

/** Panel-level pan: the CLAUDE.md rule-1 default (100/15) — this track is
 * a large surface, so it stays weighted rather than snappy. */
const PAN_SPRING = { type: "spring", stiffness: 100, damping: 15 } as const;
/** Small-element tier from rule 1's tuning note, reused for card hover
 * lift and arrow-button press feedback. */
const HOVER_SPRING = { type: "spring", stiffness: 300, damping: 26 } as const;

const CARD_WIDTH = 300;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;

const DISHES = [
  {
    course: "01",
    tag: "Smoke & brine",
    name: "Charred Octopus",
    description: "Smoked paprika, confit lemon, sea fennel.",
    price: "$28",
  },
  {
    course: "02",
    tag: "Raw intensity",
    name: "Wagyu Tartare",
    description: "Burnt onion, quail yolk, rye crisp.",
    price: "$34",
  },
  {
    course: "03",
    tag: "Earth & citrus",
    name: "Heirloom Beet",
    description: "Whipped goat curd, pistachio, blood orange.",
    price: "$22",
  },
  {
    course: "04",
    tag: "Umami depth",
    name: "Black Cod",
    description: "Miso glaze, shiso, charred scallion.",
    price: "$46",
  },
  {
    course: "05",
    tag: "Bittersweet",
    name: "Duck Breast",
    description: "Cherry gastrique, celeriac, juniper.",
    price: "$42",
  },
  {
    course: "06",
    tag: "Quiet indulgence",
    name: "Dark Chocolate",
    description: "Olive oil, sea salt, brioche crumb.",
    price: "$18",
  },
] as const;

/** Per-card radial focal point, cycled across the row so the photo-less
 * "plate" surface (see DishCard) doesn't read as one repeated texture —
 * mirrors how each Figma reference card carries its own photograph. */
const FOCAL_POINTS = ["30% 15%", "70% 20%", "40% 25%"] as const;

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
      whileTap={{ scale: 0.9 }}
      transition={HOVER_SPRING}
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
  const focalPoint = FOCAL_POINTS[index % FOCAL_POINTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
      transition={{
        opacity: { ...entrance, delay: index * 0.06 },
        y: { ...entrance, delay: index * 0.06 },
        scale: prefersReducedMotion ? { duration: 0 } : HOVER_SPRING,
      }}
      className="group relative h-[440px] w-[300px] shrink-0 overflow-hidden rounded-3xl border border-paper/10 transition-colors duration-200 hover:border-paper/25"
    >
      {/* Plate surface: the codebase has no photography and CLAUDE.md's
       * two-tone rule rules out hotlinked stock imagery, so the Figma
       * reference's photo card is translated into a radial-masked ink/paper
       * surface (rule 5) rather than faked with an external photo. */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
        style={{
          backgroundImage: `radial-gradient(120% 90% at ${focalPoint}, rgba(250,250,249,0.16), rgba(250,250,249,0.03) 55%, transparent 75%)`,
        }}
      />
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
    <section className="relative bg-ink px-6 pb-32 pt-8 text-paper">
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
