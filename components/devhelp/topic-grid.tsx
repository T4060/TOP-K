"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Transition,
} from "framer-motion";
import Link from "next/link";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { cn } from "@/lib/utils";

const TILT_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const TILT_DEGREES = 8;
const ENTRANCE_SPRING: Transition = { type: "spring", stiffness: 220, damping: 20 };
const HOVER_SPRING: Transition = { type: "spring", stiffness: 300, damping: 26 };
const EXPAND_SPRING: Transition = { type: "spring", stiffness: 220, damping: 24 };

const TOPICS = [
  {
    anchorId: "setup",
    scenarioId: "install-node",
    eyebrow: "01",
    title: "Environment setup",
    description:
      "Install the runtime, the editor, the shell — the stuff every tutorial assumes you already have.",
    learn: ["Installing Node.js & npm", "Choosing and configuring a terminal", "Setting your PATH correctly"],
    featured: true,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    anchorId: "git",
    scenarioId: "git-github",
    eyebrow: "02",
    title: "Git & GitHub",
    description:
      "Save your work, undo mistakes, and publish a project the way every team actually works.",
    learn: ["git init, add, commit", "Connecting to a GitHub remote", "Your first git push"],
    featured: false,
    span: "",
  },
  {
    anchorId: "python",
    scenarioId: "python-venv",
    eyebrow: "03",
    title: "Package managers",
    description:
      "pip, npm, venv — isolate dependencies so one project never breaks another.",
    learn: ["Creating a virtual environment", "Installing from requirements.txt", "Activating & deactivating"],
    featured: false,
    span: "",
  },
  {
    anchorId: "debug",
    scenarioId: "command-not-found",
    eyebrow: "04",
    title: "Debugging",
    description:
      "\"Command not found\" isn't a dead end — it's a PATH problem with a five-step fix.",
    learn: ["Reading the actual error", "Checking your PATH", "Reloading your shell config"],
    featured: false,
    span: "",
  },
  {
    anchorId: "ship",
    scenarioId: "deploy",
    eyebrow: "05",
    title: "Shipping it",
    description:
      "Take a project from localhost to a real URL you can send to someone else.",
    learn: ["Installing the Vercel CLI", "Deploying a preview", "Promoting to production"],
    featured: false,
    span: "md:col-span-2",
  },
] as const;

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TopicCard({
  topic,
  index,
  isActive,
  onOpen,
  onClose,
}: {
  topic: (typeof TOPICS)[number];
  index: number;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING;
  const hover = prefersReducedMotion ? { duration: 0 } : HOVER_SPRING;
  const expandTransition = prefersReducedMotion ? { duration: 0 } : EXPAND_SPRING;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, TILT_SPRING);
  const springRotateY = useSpring(rotateY, TILT_SPRING);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * TILT_DEGREES);
    rotateX.set(relY * -TILT_DEGREES);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      layoutId={`topic-card-${topic.title}`}
      layout
      id={topic.anchorId}
      role={isActive ? "dialog" : undefined}
      aria-modal={isActive || undefined}
      aria-label={isActive ? topic.title : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isActive ? undefined : onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={prefersReducedMotion || isActive ? undefined : { scale: 1.02 }}
      transition={{
        opacity: { ...entrance, delay: index * 0.08 },
        y: { ...entrance, delay: index * 0.08 },
        scale: hover,
        layout: expandTransition,
      }}
      style={
        prefersReducedMotion || isActive
          ? undefined
          : { rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 800 }
      }
      className={cn(
        "group relative flex scroll-mt-24 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-paper/10 bg-paper/[0.03] p-8 transition-colors duration-200 hover:border-paper/20 hover:bg-paper/[0.05]",
        isActive
          ? "fixed inset-6 z-[70] cursor-default sm:inset-x-auto sm:inset-y-12 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2"
          : topic.span
      )}
    >
      <FlickeringGrid
        className="absolute inset-0 [mask-image:radial-gradient(120%_90%_at_30%_20%,white,transparent)]"
        color="#fafaf9"
        maxOpacity={0.08}
        flickerChance={0.15}
        squareSize={2}
        gridGap={5}
      />
      <div className="absolute inset-0 bg-ink/10" />

      {isActive && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          whileTap={{ scale: 0.9 }}
          transition={HOVER_SPRING}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors duration-200 hover:border-paper/40 hover:bg-paper/10"
        >
          <CloseIcon />
        </motion.button>
      )}

      <span className="relative font-sans text-xs tracking-[0.2em] text-paper/40">
        {topic.eyebrow}
      </span>

      <div className="relative mt-auto">
        <h3
          className={cn(
            "font-display italic tracking-tight text-paper",
            isActive ? "text-4xl" : topic.featured ? "text-3xl" : "text-xl"
          )}
        >
          {topic.title}
        </h3>
        <p
          className={cn(
            "mt-3 font-sans leading-relaxed text-paper/60",
            isActive ? "max-w-md text-base" : "max-w-xs text-sm"
          )}
        >
          {topic.description}
        </p>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...HOVER_SPRING, delay: 0.05 }}
            className="mt-6"
          >
            <ul className="flex flex-col gap-2">
              {topic.learn.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-sans text-sm text-paper/70"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-paper/40" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`/learn/terminal?ask=${topic.scenarioId}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 font-sans text-sm font-medium text-ink transition-colors duration-200 hover:bg-paper/90"
            >
              Open in terminal
              <ArrowIcon />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function TopicGrid() {
  const prefersReducedMotion = useReducedMotion();
  const entrance = prefersReducedMotion ? { duration: 0 } : ENTRANCE_SPRING;
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!activeTitle) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveTitle(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTitle]);

  return (
    <section className="relative bg-ink px-6 py-32 text-paper">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={entrance}
          className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-paper/40"
        >
          Where to start
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ ...entrance, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="mt-4 max-w-xl font-display text-5xl italic leading-[1.02] tracking-tighter text-paper sm:text-6xl"
        >
          Five things every beginner gets stuck on.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[180px]">
          {TOPICS.map((topic, index) => (
            <TopicCard
              key={topic.title}
              topic={topic}
              index={index}
              isActive={activeTitle === topic.title}
              onOpen={() => setActiveTitle(topic.title)}
              onClose={() => setActiveTitle(null)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={() => setActiveTitle(null)}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
