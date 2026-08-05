import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ReservationsContent } from "@/components/reservations-content";

export const metadata: Metadata = {
  title: "Reservations — TOP-K",
  description: "Book a table at TOP-K.",
};

export default function ReservationsPage() {
  return (
    <main>
      <Navbar />
      <ReservationsContent />
    </main>
  );
}
