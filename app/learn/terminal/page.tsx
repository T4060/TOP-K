import type { Metadata } from "next";
import { DevNavbar } from "@/components/devhelp/dev-navbar";
import { LessonCard } from "@/components/devhelp/lesson-card";
import { DevFooter } from "@/components/devhelp/dev-footer";
import { TERMINAL_SCENARIOS, matchScenario } from "@/lib/terminal-scenarios";

export const metadata: Metadata = {
  title: "Lesson — cmdline",
  description: "One step at a time — real terminal commands, gamified.",
};

const DEFAULT_TOPIC_ID = "install-node";

function resolveScenario(ask?: string) {
  if (!ask) {
    return TERMINAL_SCENARIOS.find((s) => s.id === DEFAULT_TOPIC_ID) ?? TERMINAL_SCENARIOS[0]!;
  }
  return TERMINAL_SCENARIOS.find((s) => s.id === ask) ?? matchScenario(ask);
}

export default function TerminalPage({
  searchParams,
}: {
  searchParams: { ask?: string };
}) {
  const scenario = resolveScenario(searchParams.ask);

  return (
    <main>
      <DevNavbar />
      <section className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center bg-[#F7F7F5] px-4 py-12 sm:px-6">
        <LessonCard scenario={scenario} />
      </section>
      <DevFooter />
    </main>
  );
}
