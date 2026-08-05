"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReservationForm } from "@/components/reservation-form";

const SPRING = { type: "spring", stiffness: 100, damping: 15 } as const;

const HOURS = [
  { day: "Mon – Thu", time: "5 PM – 12 AM" },
  { day: "Fri – Sat", time: "5 PM – 2 AM" },
  { day: "Sun", time: "Closed" },
] as const;

export function ReservationsContent() {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;

  return (
    <section className="relative w-full bg-paper px-6 py-40">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60"
          >
            Reservations
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
            className="mt-6 font-display text-5xl italic leading-[1.1] tracking-tight text-ink"
          >
            Book your table.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.16 }}
            className="mt-6 max-w-md font-sans text-lg leading-relaxed text-ink/70"
          >
            Reserve online in a few seconds, or reach us directly — either
            way, we&apos;ll have your table ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.24 }}
            className="mt-10 flex flex-col gap-2 font-sans text-base text-ink"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.32 }}
            className="mt-14 max-w-sm border-t border-ink/10 pt-8"
          >
            <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/40">
              Opening hours
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {HOURS.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between font-sans text-sm text-ink/70"
                >
                  <span>{row.day}</span>
                  <span>{row.time}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.2 }}
          className="rounded-3xl border border-ink/10 bg-ink/[0.02] p-8 sm:p-10"
        >
          <ReservationForm />
        </motion.div>
      </div>
    </section>
  );
}
