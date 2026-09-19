import type { Metadata } from "next";
import { DevNavbar } from "@/components/devhelp/dev-navbar";
import { DevHero } from "@/components/devhelp/dev-hero";
import { PathMap } from "@/components/devhelp/path-map";
import { HowItWorks } from "@/components/devhelp/how-it-works";
import { DevFooter } from "@/components/devhelp/dev-footer";

export const metadata: Metadata = {
  title: "cmdline — learn to code, in your terminal",
  description:
    "A premium, real-terminal path through the skills every beginner needs — real commands, one lesson at a time, ending in a website you actually ship.",
};

export default function LearnPage() {
  return (
    <main>
      <DevNavbar />
      <DevHero />
      <section className="bg-duo-surface px-6 py-20">
        <p className="mb-12 text-center font-duo-body text-xs font-medium uppercase tracking-[0.25em] text-duo-ink/40">
          Your path
        </p>
        <PathMap />
      </section>
      <HowItWorks />
      <DevFooter />
    </main>
  );
}
