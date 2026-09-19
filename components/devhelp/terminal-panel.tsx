"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DEFAULT_SCENARIO,
  TERMINAL_SCENARIOS,
  matchScenario,
  type TerminalScenario,
} from "@/lib/terminal-scenarios";

const ENTRANCE: Transition = { type: "spring", stiffness: 220, damping: 20 };
const HOVER: Transition = { type: "spring", stiffness: 300, damping: 26 };
const STEP_STAGGER = 0.09;

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.5 9.5v-6A1 1 0 013.5 2.5h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : HOVER;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — nothing to fall back to without a
      // visible textarea hack, so the button simply stays in its default state.
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
      transition={transition}
      aria-label={copied ? "Copied" : "Copy command"}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
        copied
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          : "border-paper/15 text-paper/50 hover:border-paper/30 hover:bg-paper/5 hover:text-paper/80"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={transition}
          className="flex items-center justify-center"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function ScenarioResult({ scenario, query }: { scenario: TerminalScenario; query: string }) {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE;

  return (
    <div className="flex flex-col gap-5">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={entrance}
        className="font-mono text-sm text-paper/50"
      >
        <span className="text-emerald-400">$</span> help me with{" "}
        <span className="text-paper/80">{query || scenario.label.toLowerCase()}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...entrance, delay: prefersReducedMotion ? 0 : STEP_STAGGER }}
        className="font-sans text-base leading-relaxed text-paper/70"
      >
        {scenario.summary}
      </motion.p>

      <ol className="flex flex-col gap-4">
        {scenario.steps.map((step, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...entrance,
              delay: prefersReducedMotion ? 0 : STEP_STAGGER * (index + 2),
            }}
            className="flex gap-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-paper/20 font-mono text-xs text-paper/60">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="font-sans text-sm leading-relaxed text-paper/85">
                {step.explain}
              </p>
              {step.command && (
                <div className="flex items-center gap-3 rounded-lg border border-paper/10 bg-paper/[0.04] px-4 py-3">
                  <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[13px] text-emerald-300">
                    {step.command}
                  </code>
                  <CopyButton command={step.command} />
                </div>
              )}
              {step.note && (
                <p className="font-sans text-xs leading-relaxed text-paper/45">
                  {step.note}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function TerminalPanel({ initialAsk }: { initialAsk?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const hoverTransition = prefersReducedMotion ? { duration: 0 } : HOVER;

  const initialScenario = useMemo(() => {
    if (!initialAsk) return null;
    const byId = TERMINAL_SCENARIOS.find((s) => s.id === initialAsk);
    return byId ?? matchScenario(initialAsk);
  }, [initialAsk]);

  const [query, setQuery] = useState(initialScenario?.label ?? "");
  const [result, setResult] = useState<{ scenario: TerminalScenario; query: string } | null>(
    initialScenario ? { scenario: initialScenario, query: initialScenario.label } : null
  );
  const [runKey, setRunKey] = useState(0);

  function run(q: string) {
    const scenario = matchScenario(q) ?? DEFAULT_SCENARIO;
    setResult({ scenario, query: q });
    setRunKey((k) => k + 1);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    run(query);
  }

  function handleChip(scenario: TerminalScenario) {
    setQuery(scenario.label);
    run(scenario.label);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-wrap justify-center gap-2">
        {TERMINAL_SCENARIOS.map((scenario) => (
          <motion.button
            key={scenario.id}
            type="button"
            onClick={() => handleChip(scenario)}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04, y: -1 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={hoverTransition}
            className="rounded-full border border-ink/15 bg-paper px-4 py-2 font-sans text-xs text-ink/70 transition-colors duration-200 hover:border-ink/30 hover:text-ink"
          >
            {scenario.label}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-ink shadow-[0_20px_60px_-20px_rgba(10,10,10,0.35)]">
        <div className="flex items-center gap-2 border-b border-paper/10 bg-paper/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-paper/15" />
          <span className="h-3 w-3 rounded-full bg-paper/15" />
          <span className="h-3 w-3 rounded-full bg-paper/15" />
          <span className="ml-2 font-mono text-xs text-paper/40">zsh — cmdline</span>
        </div>

        <div className="max-h-[28rem] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <span className="font-mono text-sm text-emerald-400">$</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="help me install node..."
              aria-label="Describe what you need help with"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-paper placeholder:text-paper/30 focus:outline-none"
            />
            <motion.button
              type="submit"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              transition={hoverTransition}
              className="shrink-0 rounded-full bg-paper px-4 py-1.5 font-sans text-xs font-medium text-ink transition-colors duration-200 hover:bg-paper/90"
            >
              Run
            </motion.button>
          </form>

          <div className="mt-8 border-t border-paper/10 pt-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={runKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.15 }}
                >
                  <ScenarioResult scenario={result.scenario} query={result.query} />
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-sm text-paper/35"
                >
                  Type what you&apos;re stuck on, or pick a suggestion above.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
