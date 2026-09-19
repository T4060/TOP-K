import { Baloo_2, Nunito } from "next/font/google";

/**
 * CLAUDE.md rule-4 exception: the site-wide rule pairs a serif display
 * face with a neutral sans for body copy. cmdline was explicitly
 * commissioned as a Duolingo-style redesign — bold, rounded, all-sans is
 * the entire visual identity there; a serif headline would fight the
 * brand rather than express it. We keep the *spirit* of rule 4 (exactly
 * two type families, one for display, one for body/UI) and swap which
 * two: Baloo 2 (chunky rounded display) + Nunito (rounded body/UI sans),
 * both scoped to this route group only — TOP-K's Fraunces/Inter pairing
 * is untouched everywhere else in the app.
 */
const duoDisplay = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-duo-display",
  display: "swap",
});

const duoBody = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-duo-body",
  display: "swap",
});

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${duoDisplay.variable} ${duoBody.variable} min-h-screen bg-duo-bg font-duo-body text-duo-ink`}
    >
      {children}
    </div>
  );
}
