"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  cancelReservation,
  createReservation,
  getReservations,
  type Reservation,
  type ReservationInput,
} from "@/lib/reservations";

/** Fluid layout tier — CLAUDE.md rule 1's 220/20 named tier. */
const ENTRANCE_SPRING = { type: "spring", stiffness: 220, damping: 20 } as const;
/** Snappy interaction tier — CLAUDE.md rule 1's 280/18 named tier. */
const PRESS_SPRING = { type: "spring", stiffness: 280, damping: 18 } as const;

const EMPTY_FORM: ReservationInput = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  partySize: 2,
  notes: "",
};

const FIELD_CLASS =
  "w-full border-b border-ink/15 bg-transparent py-2 font-sans text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink/30 focus:border-ink";
const LABEL_CLASS =
  "font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50";

/** Wraps a form field so it grows slightly on focus — layout-driven (rule
 * 3's sanctioned exception) rather than a raw width/padding transition,
 * giving immediate feedback per the micro-interaction spec. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  function handleFocus(e: FocusEvent<HTMLLabelElement>) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      setFocused(true);
    }
  }

  return (
    <motion.label
      layout
      onFocus={handleFocus}
      onBlur={() => setFocused(false)}
      animate={
        prefersReducedMotion ? undefined : { scale: focused ? 1.03 : 1 }
      }
      transition={prefersReducedMotion ? { duration: 0 } : PRESS_SPRING}
      className="flex origin-left flex-col gap-2"
    >
      <span className={LABEL_CLASS}>{label}</span>
      {children}
    </motion.label>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function validate(input: ReservationInput): string | null {
  if (!input.name.trim()) return "Add a name for the reservation.";
  if (!/^\S+@\S+\.\S+$/.test(input.email)) return "Enter a valid email.";
  if (!input.phone.trim()) return "Add a phone number.";
  if (!input.date) return "Choose a date.";
  if (input.date < todayISO()) return "Choose a date that hasn't passed.";
  if (new Date(`${input.date}T00:00:00`).getDay() === 0) {
    return "We're closed Sundays — pick another day.";
  }
  if (!input.time) return "Choose a time.";
  if (input.partySize < 1 || input.partySize > 12) {
    return "Party size must be between 1 and 12.";
  }
  return null;
}

function ReservationRow({
  reservation,
  onCancel,
}: {
  reservation: Reservation;
  onCancel: (id: string) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={
        prefersReducedMotion ? undefined : { scale: 1.015, transition: PRESS_SPRING }
      }
      transition={prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING}
      className="flex items-center justify-between gap-4 rounded-lg border-b border-ink/10 px-2 py-4"
    >
      <div>
        <p className="font-display text-lg italic text-ink">
          {reservation.name}
        </p>
        <p className="mt-0.5 font-sans text-xs text-ink/50">
          {reservation.date} · {reservation.time} · Party of{" "}
          {reservation.partySize}
        </p>
      </div>
      <motion.button
        type="button"
        onClick={() => onCancel(reservation.id)}
        whileTap={{ scale: 0.92 }}
        transition={PRESS_SPRING}
        className="shrink-0 font-sans text-xs uppercase tracking-[0.15em] text-ink/40 transition-colors duration-200 hover:text-ink"
      >
        Cancel
      </motion.button>
    </motion.li>
  );
}

export function ReservationForm() {
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState<ReservationInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "partySize" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStatus("submitting");

    // Simulated round trip — this is a client-only "database" (localStorage),
    // but the async gap keeps the submit/success states honest for anyone
    // watching the UI rather than resolving suspiciously instantly.
    window.setTimeout(() => {
      const created = createReservation(form);
      setReservations((prev) =>
        [...prev, created].sort((a, b) =>
          `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
        )
      );
      setForm(EMPTY_FORM);
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 3000);
    }, 500);
  }

  function handleCancel(id: string) {
    setReservations(cancelReservation(id));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 010-2000"
              className={FIELD_CLASS}
            />
          </Field>
        </div>

        <Field label="Email">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            className={FIELD_CLASS}
          />
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Field label="Date">
            <input
              name="date"
              type="date"
              min={todayISO()}
              value={form.date}
              onChange={handleChange}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Time">
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className={FIELD_CLASS}
            />
          </Field>
          <Field label="Party size">
            <input
              name="partySize"
              type="number"
              min={1}
              max={12}
              value={form.partySize}
              onChange={handleChange}
              className={FIELD_CLASS}
            />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Allergies, special occasion, seating preference…"
            rows={2}
            className={`${FIELD_CLASS} resize-none`}
          />
        </Field>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING}
              className="font-sans text-sm text-red-700"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={status === "submitting"}
          whileTap={{ scale: 0.96 }}
          transition={PRESS_SPRING}
          className="mt-2 inline-flex items-center justify-center self-start rounded-full bg-ink px-8 py-4 font-sans text-sm font-medium tracking-wide text-paper transition-colors duration-200 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Booking…" : "Reserve"}
        </motion.button>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING}
              className="font-sans text-sm text-ink/70"
            >
              Table booked — we&apos;ll see you then.
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {reservations.length > 0 && (
        <div className="mt-14 border-t border-ink/10 pt-8">
          <p className={LABEL_CLASS}>Your reservations</p>
          <ul className="mt-4">
            <AnimatePresence initial={false}>
              {reservations.map((reservation) => (
                <ReservationRow
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}
