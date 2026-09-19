import type { Metadata } from "next";
import { DevNavbar } from "@/components/devhelp/dev-navbar";
import { DevHero } from "@/components/devhelp/dev-hero";
import { HowItWorks } from "@/components/devhelp/how-it-works";
import { TopicGrid } from "@/components/devhelp/topic-grid";
import { DevFooter } from "@/components/devhelp/dev-footer";

export const metadata: Metadata = {
  title: "cmdline — learn to code, in your terminal",
  description:
    "Type what you're stuck on and get exact, numbered terminal commands — built for people learning to code.",
};

export default function LearnPage() {
  return (
    <main>
      <DevNavbar />
      <DevHero />
      <HowItWorks />
      <TopicGrid />
      <DevFooter />
    </main>
  );
}
