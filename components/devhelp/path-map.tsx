"use client";

import { useDuoProgress } from "@/lib/duo-progress";
import { PathNode } from "@/components/devhelp/path-node";
import { Mascot } from "@/components/devhelp/mascot";

const GAP = 150;
/** Fixed px offsets — well within even the narrowest phone widths (max
 * node edge sits ~118px from center), so nodes never need viewport-based
 * scaling that could drift out of sync with a connecting line. */
const OFFSETS = [0, 78, -78, 78, -78, 0];

const PATH_TOPICS = [
  { id: "install-node", icon: "🖥️", label: "Environment setup", color: "green" as const },
  { id: "git-github", icon: "🌱", label: "Git & GitHub", color: "blue" as const },
  { id: "python-venv", icon: "🐍", label: "Package managers", color: "purple" as const },
  { id: "command-not-found", icon: "🪲", label: "Debugging", color: "red" as const },
  { id: "react-app", icon: "⚛️", label: "Frontend scaffolding", color: "gold" as const },
  { id: "deploy", icon: "🚀", label: "Shipping it", color: "blue" as const },
];

export function PathMap() {
  const { progress, hydrated } = useDuoProgress();

  const nodes = PATH_TOPICS.map((topic, index) => {
    const isComplete = progress.completed.includes(topic.id);
    const prevComplete = index === 0 || progress.completed.includes(PATH_TOPICS[index - 1]!.id);
    const status: "locked" | "current" | "complete" = isComplete
      ? "complete"
      : prevComplete
        ? "current"
        : "locked";
    return { ...topic, status, x: OFFSETS[index] ?? 0, y: index * GAP + 60 };
  });

  const mapHeight = (PATH_TOPICS.length - 1) * GAP + 160;

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
            "repeating-linear-gradient(to bottom, #E5E5E5 0, #E5E5E5 14px, transparent 14px, transparent 28px)",
        }}
      />

      {nodes.map((node, index) => (
        <PathNode
          key={node.id}
          id={node.id}
          icon={node.icon}
          label={node.label}
          color={node.color}
          x={node.x}
          y={node.y}
          index={index}
          status={hydrated ? node.status : index === 0 ? "current" : "locked"}
        />
      ))}

      <div
        className="absolute -translate-x-1/2"
        style={{ left: `calc(50% + ${OFFSETS[PATH_TOPICS.length - 1]}px)`, top: mapHeight - 4 }}
      >
        <Mascot size={90} />
      </div>
    </div>
  );
}
