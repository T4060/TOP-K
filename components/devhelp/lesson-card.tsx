"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { DuoButton } from "@/components/devhelp/duo-button";
import { Mascot } from "@/components/devhelp/mascot";
import { CopyButton } from "@/components/devhelp/copy-button";
import { ConfettiBurst } from "@/components/devhelp/confetti-burst";
import { XPBadge } from "@/components/devhelp/xp-badge";
import { StreakBadge } from "@/components/devhelp/streak-badge";
import { useDuoProgress } from "@/lib/duo-progress";
import type { TerminalScenario } from "@/lib/terminal-scenarios";

const ENTRANCE: Transition = { type: "spring", stiffness: 260, damping: 24 };
const BAR_SPRING: Transition = { type: "spring", stiffness: 200, damping: 28 };

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LessonCard({ scenario }: { scenario: TerminalScenario }) {
  const prefersReducedMotion = useReducedMotion();
  const { progress, markComplete, hydrated } = useDuoProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setFinished(false);
  }, [scenario.id]);

  const totalSteps = scenario.steps.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const step = scenario.steps[stepIndex]!;
  const progressRatio = (stepIndex + (finished ? 1 : 0)) / totalSteps;

  function handleContinue() {
    if (isLastStep) {
      markComplete(scenario.id);
      setFinished(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handlePracticeAgain() {
    setStepIndex(0);
    setFinished(false);
  }

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-2 border-duo-track bg-white p-6 shadow-[0_4px_0_#E5E5E5] sm:p-8">
      {!finished && (
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/learn"
            aria-label="Exit lesson"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-duo-ink/40 transition-colors duration-200 hover:bg-duo-track/50 hover:text-duo-ink"
          >
            <CloseIcon />
          </Link>
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-duo-track">
            <motion.div
              className="h-full origin-left rounded-full bg-duo-green"
              initial={false}
              animate={{ scaleX: Math.max(progressRatio, 0.04) }}
              transition={BAR_SPRING}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ENTRANCE}
            className="relative flex flex-col items-center py-4 text-center"
          >
            <ConfettiBurst />
            <Mascot size={140} mood="celebrate" />
            <h2 className="mt-4 font-duo-display text-3xl font-extrabold text-duo-ink">
              Lesson complete!
            </h2>
            <p className="mt-2 max-w-sm font-duo-body text-sm font-medium text-duo-ink/60">
              {scenario.label} is done. Those commands are real — you just ran the exact
              playbook a working dev would.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <XPBadge xp={hydrated ? progress.xp : 0} />
              <StreakBadge streak={hydrated ? progress.streak : 0} />
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <DuoButton color="green" magnetic href="/learn">
                Back to path
              </DuoButton>
              <DuoButton color="white" onClick={handlePracticeAgain}>
                Practice again
              </DuoButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
            transition={ENTRANCE}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-duo-display text-xs font-extrabold uppercase tracking-wide text-duo-blue">
                  Step {stepIndex + 1} of {totalSteps}
                </p>
                <h2 className="mt-2 font-duo-display text-2xl font-extrabold leading-snug text-duo-ink sm:text-3xl">
                  {step.explain}
                </h2>
              </div>
              <Mascot size={72} />
            </div>

            {step.command && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-duo-ink px-4 py-4">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[13px] text-duo-green">
                  {step.command}
                </code>
                <CopyButton command={step.command} />
              </div>
            )}

            {step.note && (
              <p className="mt-4 rounded-xl bg-duo-blue/10 px-4 py-3 font-duo-body text-sm font-semibold text-duo-blue-dark">
                {step.note}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <DuoButton color="green" magnetic onClick={handleContinue} size="lg">
                {isLastStep ? "Finish" : "Continue"}
              </DuoButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
