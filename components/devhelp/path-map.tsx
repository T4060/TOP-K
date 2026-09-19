"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useDuoProgress } from "@/lib/duo-progress";
import { PathNode } from "@/components/devhelp/path-node";

const GAP = 150;
/** Extra vertical room reserved above a node that starts a new tier, so
 * its section label has space without needing a second coordinate system. */
const TIER_GAP = 60;

/** Fixed px offsets — well within even the narrowest phone widths (max
 * node edge sits ~118px from center), so nodes never need viewport-based
 * scaling that could drift out of sync with a connecting line. */
const OFFSETS = [0, 78, -78, 78, -78, 0];

const PATH_TOPICS = [
  { id: "shell-basics", icon: "📁", label: "Navigate the shell", color: "green" as const },
  { id: "install-node", icon: "🖥️", label: "Environment setup", color: "blue" as const },
  { id: "git-github", icon: "🌱", label: "Git & GitHub", color: "purple" as const },
  { id: "command-not-found", icon: "🪲", label: "Debugging", color: "red" as const },
  { id: "python-venv", icon: "🐍", label: "Package managers", color: "gold" as const },
  { id: "react-app", icon: "⚛️", label: "Frontend scaffolding", color: "blue" as const },
  { id: "env-vars-secrets", icon: "🔐", label: "Secrets & env vars", color: "purple" as const },
  { id: "fetch-api", icon: "🌐", label: "Call a real API", color: "green" as const },
  { id: "testing-basics", icon: "✅", label: "Run a test suite", color: "red" as const },
  { id: "ai-assisted-coding", icon: "🤖", label: "Code with AI", color: "gold" as const },
  { id: "deploy", icon: "🚀", label: "Shipping it", color: "blue" as const },
  { id: "build-a-website-with-ai", icon: "🏆", label: "Build a website with AI", color: "gold" as const },
] as const;

/** index -> section label. Marks where each difficulty tier begins. */
const TIER_LABELS: Record<number, string> = {
  0: "Foundations",
  5: "Building",
  9: "Leveling up",
};

const CAPSTONE_ID = "build-a-website-with-ai";

export function PathMap() {
  const { progress, hydrated } = useDuoProgress();
  const prefersReducedMotion = useReducedMotion();
  const entrance: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 220, damping: 20 };

  let cursorY = 70;
  const nodes = PATH_TOPICS.map((topic, index) => {
    if (index > 0) cursorY += GAP;
    if (TIER_LABELS[index] !== undefined) cursorY += TIER_GAP;

    const isComplete = progress.completed.includes(topic.id);
    const prevComplete = index === 0 || progress.completed.includes(PATH_TOPICS[index - 1]!.id);
    const status: "locked" | "current" | "complete" = isComplete
      ? "complete"
      : prevComplete
        ? "current"
        : "locked";

    return { ...topic, status, x: OFFSETS[index % OFFSETS.length] ?? 0, y: cursorY };
  });

  const mapHeight = cursorY + 60;

  return (
    <div className="relative mx-auto" style={{ maxWidth: 400, height: mapHeight }}>
      {/* Straight center guide — deliberately not a curve tracing the
       * zigzag: a curve would need an SVG viewBox scaled to the
       * container's rendered width, which drifts out of sync with the
       * nodes' own px offsets on narrower viewports. A center guide line
       * scales exactly (it's just 100% height at 50% left) at any width. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 rounded-full"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #2C2823 0, #2C2823 14px, transparent 14px, transparent 28px)",
        }}
      />

      {nodes.map((node, index) => (
        <div key={node.id}>
          {TIER_LABELS[index] !== undefined && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={entrance}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-duo-body text-xs font-medium uppercase tracking-[0.25em] text-duo-ink/35"
              style={{ top: node.y - TIER_GAP - 8 }}
            >
              {TIER_LABELS[index]}
            </motion.p>
          )}
          <PathNode
            id={node.id}
            icon={node.icon}
            label={node.label}
            color={node.color}
            x={node.x}
            y={node.y}
            index={index}
            status={hydrated ? node.status : index === 0 ? "current" : "locked"}
            capstone={node.id === CAPSTONE_ID}
          />
        </div>
      ))}
    </div>
  );
}
