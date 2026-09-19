"use client";

import Link from "next/link";
import { DuoButton } from "@/components/devhelp/duo-button";
import { StreakBadge } from "@/components/devhelp/streak-badge";
import { XPBadge } from "@/components/devhelp/xp-badge";
import { useDuoProgress } from "@/lib/duo-progress";
import { TERMINAL_SCENARIOS } from "@/lib/terminal-scenarios";

export function DevNavbar() {
  const { progress, hydrated } = useDuoProgress();
  const nextScenario =
    TERMINAL_SCENARIOS.find((s) => !progress.completed.includes(s.id)) ?? TERMINAL_SCENARIOS[0]!;

  return (
    <header className="sticky top-0 z-50 border-b border-duo-track bg-duo-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/learn"
          className="font-duo-display text-2xl italic text-duo-green"
        >
          cmdline
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/learn"
            className="font-duo-body text-sm text-duo-ink/55 transition-colors duration-200 hover:text-duo-ink"
          >
            Path
          </Link>
          <Link
            href="/learn#how-it-works"
            className="font-duo-body text-sm text-duo-ink/55 transition-colors duration-200 hover:text-duo-ink"
          >
            How it&apos;s different
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {hydrated && progress.streak > 0 && <StreakBadge streak={progress.streak} />}
          {hydrated && progress.xp > 0 && (
            <div className="hidden sm:block">
              <XPBadge xp={progress.xp} />
            </div>
          )}
          <DuoButton href={`/learn/terminal?ask=${nextScenario.id}`} color="green" size="sm" magnetic>
            Continue
          </DuoButton>
        </div>
      </div>
    </header>
  );
}
