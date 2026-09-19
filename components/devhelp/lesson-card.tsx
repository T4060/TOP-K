"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { DuoButton } from "@/components/devhelp/duo-button";
import { CopyButton } from "@/components/devhelp/copy-button";
import { ConfettiBurst } from "@/components/devhelp/confetti-burst";
import { XPBadge } from "@/components/devhelp/xp-badge";
import { StreakBadge } from "@/components/devhelp/streak-badge";
import { useDuoProgress } from "@/lib/duo-progress";
import type { ScenarioLevel, TerminalScenario } from "@/lib/terminal-scenarios";

const ENTRANCE: Transition = { type: "spring", stiffness: 260, damping: 24 };
const BAR_SPRING: Transition = { type: "spring", stiffness: 200, damping: 28 };

/** Harder lessons pay out more — makes the difficulty ramp legible, not
 * just longer. */
const XP_BY_LEVEL: Record<ScenarioLevel, number> = {
  beginner: 10,
  intermediate: 15,
  advanced: 25,
};

const LEVEL_PILL: Record<ScenarioLevel, string> = {
  beginner: "bg-duo-green/20 text-duo-green",
  intermediate: "bg-duo-blue text-duo-ink",
  advanced: "bg-duo-red text-duo-ink",
};

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
  const isLastStep = stepIndex >= totalSteps - 1;
  const xpAward = XP_BY_LEVEL[scenario.level];

  /**
   * `stepIndex` is clamped here rather than trusted as always in-bounds:
   * a fast repeat-click on Continue/Finish (a real DuoButton whileTap +
   * click race, reproduced under Playwright and not just a test
   * artifact — confirmed against a production build) can advance
   * `stepIndex` past the last step in the same tick `isLastStep` was
   * still read as true by a prior click's closure. The effect below is
   * the single place that decides "finished"; clamping here just keeps
   * every render safe in the meantime instead of reading
   * `undefined.explain`.
   */
  const step = scenario.steps[Math.min(stepIndex, totalSteps - 1)]!;
  const progressRatio = (stepIndex + (finished ? 1 : 0)) / totalSteps;

  useEffect(() => {
    if (stepIndex >= totalSteps && !finished) {
      markComplete(scenario.id, xpAward);
      setFinished(true);
    }
  }, [stepIndex, totalSteps, finished, scenario.id, xpAward, markComplete]);

  function handleContinue() {
    setStepIndex((i) => (i >= totalSteps - 1 ? totalSteps : i + 1));
  }

  function handlePracticeAgain() {
    setStepIndex(0);
    setFinished(false);
  }

  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-duo-track bg-duo-surface p-6 shadow-[0_4px_0_rgba(0,0,0,0.4)] sm:p-8">
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
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-duo-gold/40 bg-duo-gold/10"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 13l5 6L20 6"
                  stroke="#E4C275"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 className="mt-4 font-duo-display text-3xl italic text-duo-ink">
              Lesson complete.
            </h2>
            <p className="mt-2 max-w-sm font-duo-body text-sm text-duo-ink/55">
              {scenario.label} is done. Those commands are real — you just ran the exact
              playbook a working dev would.
            </p>
            <p className="mt-1 font-duo-body text-sm font-semibold text-duo-gold">
              +{xpAward} XP
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
            <div className="flex items-center gap-3">
              <p className="font-duo-body text-xs font-medium uppercase tracking-[0.15em] text-duo-green">
                Step {stepIndex + 1} of {totalSteps}
              </p>
              <span
                className={`rounded-full px-2.5 py-0.5 font-duo-body text-[10px] font-semibold uppercase tracking-wide ${LEVEL_PILL[scenario.level]}`}
              >
                {scenario.level}
              </span>
            </div>
            <h2 className="mt-3 font-duo-display text-2xl italic leading-snug text-duo-ink sm:text-3xl">
              {step.explain}
            </h2>

            {step.command && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-duo-track bg-black/40 px-4 py-4">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[13px] text-duo-gold">
                  {step.command}
                </code>
                <CopyButton command={step.command} />
              </div>
            )}

            {step.note && (
              <p className="mt-4 border-l-2 border-duo-gold/50 py-1 pl-4 font-duo-body text-sm text-duo-ink/60">
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
