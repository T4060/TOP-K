import { Fraunces, Inter } from "next/font/google";

/**
 * cmdline was rebuilt as a premium, dark, jewel-toned product — no
 * longer the Duolingo-style bright/rounded identity, so the earlier
 * rule-4 exception (Baloo 2 + Nunito in place of the site's serif/sans
 * pairing) no longer applies: this now uses the same Fraunces italic
 * display + Inter body pairing as the rest of TOP-K, matching rule 4
 * directly rather than deviating from it. Loaded separately from the
 * root layout's copies (different weights/styles needed here) but into
 * the same --font-duo-* CSS vars the /learn components already read, so
 * no component classNames needed touching for the swap.
 */
const duoDisplay = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-duo-display",
  display: "swap",
});

const duoBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
