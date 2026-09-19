import type { Metadata } from "next";
import { DevNavbar } from "@/components/devhelp/dev-navbar";
import { DevHero } from "@/components/devhelp/dev-hero";
import { PathMap } from "@/components/devhelp/path-map";
import { HowItWorks } from "@/components/devhelp/how-it-works";
import { DevFooter } from "@/components/devhelp/dev-footer";

export const metadata: Metadata = {
  title: "cmdline — learn to code, in your terminal",
  description:
    "A gamified, Duolingo-style path through the terminal skills every beginner needs — real commands, one lesson at a time.",
};

export default function LearnPage() {
  return (
    <main>
      <DevNavbar />
      <DevHero />
      <section className="bg-[#F7F7F5] px-6 py-20">
        <p className="mb-12 text-center font-duo-display text-xs font-extrabold uppercase tracking-[0.2em] text-duo-ink/40">
          Your path
        </p>
        <PathMap />
      </section>
      <HowItWorks />
      <DevFooter />
    </main>
  );
}
