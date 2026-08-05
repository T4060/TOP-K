"use client";

import { motion } from "framer-motion";
import { AmbientCanvas } from "@/components/ambient-canvas";
import { ReservationForm } from "@/components/reservation-form";
import { Stagger, StaggerItem } from "@/components/stagger";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Snappy interaction tier — CLAUDE.md rule 1's 280/18 named tier, for
 * the hours list's hover-driven layout growth. */
const ROW_SPRING = { type: "spring", stiffness: 280, damping: 18 } as const;
/** Fluid layout tier — CLAUDE.md rule 1's 220/20 named tier, for the
 * form panel's entrance. */
const PANEL_SPRING = { type: "spring", stiffness: 220, damping: 20 } as const;

const HOURS = [
  { day: "Mon – Thu", time: "5 PM – 12 AM" },
  { day: "Fri – Sat", time: "5 PM – 2 AM" },
  { day: "Sun", time: "Closed" },
] as const;

function HoursRow({ day, time }: { day: string; time: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.li
      layout
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03, x: 4 }}
      transition={prefersReducedMotion ? { duration: 0 } : ROW_SPRING}
      className="flex origin-left items-center justify-between rounded-lg px-2 py-1 font-sans text-sm text-ink/70 hover:bg-ink/[0.04] hover:text-ink"
    >
      <span>{day}</span>
      <span>{time}</span>
    </motion.li>
  );
}

export function ReservationsContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-paper px-6 py-40">
      <AmbientCanvas
        className="absolute inset-0 [mask-image:radial-gradient(90%_70%_at_50%_20%,white,transparent)]"
        color="#0a0a0a"
        maxOpacity={0.05}
        flickerChance={0.1}
        squareSize={3}
        gridGap={7}
      />
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-24">
        <Stagger>
          <StaggerItem>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60">
              Reservations
            </p>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <h1 className="font-display text-6xl italic leading-[0.98] tracking-tighter text-ink">
              Book your table.
            </h1>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <p className="max-w-md font-sans text-lg leading-relaxed text-ink/70">
              Reserve online in a few seconds, or reach us directly — either
              way, we&apos;ll have your table ready.
            </p>
          </StaggerItem>

          <StaggerItem className="mt-10 flex flex-col gap-2 font-sans text-base text-ink">
            <a
              href="tel:+15550107000"
              className="w-fit transition-colors duration-200 hover:text-ink/60"
            >
              (555) 010-7000
            </a>
            <a
              href="mailto:reservations@topk.restaurant"
              className="w-fit transition-colors duration-200 hover:text-ink/60"
            >
              reservations@topk.restaurant
            </a>
          </StaggerItem>

          <StaggerItem className="mt-14 max-w-sm border-t border-ink/10 pt-8">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/40">
              Opening hours
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {HOURS.map((row) => (
                <HoursRow key={row.day} day={row.day} time={row.time} />
              ))}
            </ul>
          </StaggerItem>
        </Stagger>

        <motion.div
          initial={{ scale: 0.96, y: 20 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={prefersReducedMotion ? { duration: 0 } : PANEL_SPRING}
          className="rounded-3xl border border-ink/10 bg-ink/[0.02] p-8 sm:p-10"
        >
          <ReservationForm />
        </motion.div>
      </div>
    </section>
  );
}
