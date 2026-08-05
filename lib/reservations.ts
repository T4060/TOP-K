export type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  partySize: number;
  notes: string;
  createdAt: string; // ISO
};

export type ReservationInput = Omit<Reservation, "id" | "createdAt">;

const STORAGE_KEY = "topk:reservations";

/** Simulated database: reservations persist in this browser via
 * localStorage, keyed and sorted so the "table" behaves like a real store
 * without standing up an actual backend. */
export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Reservation[];
  } catch {
    return [];
  }
}

function persist(reservations: Reservation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch {
    // Storage unavailable (private browsing, quota) — the in-memory state
    // the caller already holds still reflects the change for this session.
  }
}

export function createReservation(input: ReservationInput): Reservation {
  const reservation: Reservation = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [...getReservations(), reservation].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );
  persist(next);
  return reservation;
}

export function cancelReservation(id: string): Reservation[] {
  const next = getReservations().filter((r) => r.id !== id);
  persist(next);
  return next;
}
