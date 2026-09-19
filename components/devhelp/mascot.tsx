"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";

const BOB: Transition = { type: "spring", stiffness: 60, damping: 8 };
const CELEBRATE_SPRING: Transition = { type: "spring", stiffness: 260, damping: 12 };

/**
 * "Blip" — cmdline's original mascot. A rounded terminal-block character
 * (not a bird, not Duolingo's owl) so the gamified pattern is expressed
 * without borrowing anyone else's IP. Idle motion is a slow bob + eye
 * blink, both spring-driven loops (rule 1's stated exception is for
 * truly indeterminate motion — an oscillating spring loop still resolves
 * physically each cycle, so no tween is needed here).
 */
export function Mascot({
  size = 160,
  mood = "idle",
}: {
  size?: number;
  mood?: "idle" | "celebrate";
}) {
  const prefersReducedMotion = useReducedMotion();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 2600);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      animate={
        prefersReducedMotion
          ? undefined
          : mood === "celebrate"
            ? { y: [0, -14, 0] }
            : { y: [0, -6, 0] }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : { ...BOB, duration: mood === "celebrate" ? 0.6 : 2.2, repeat: Infinity }
      }
    >
      <ellipse cx="100" cy="182" rx="46" ry="8" fill="#000" opacity="0.08" />

      {/* left arm */}
      <motion.rect
        x="28"
        y="96"
        width="20"
        height="46"
        rx="10"
        fill="#46A302"
        animate={
          prefersReducedMotion
            ? undefined
            : { rotate: mood === "celebrate" ? -50 : -8 }
        }
        transition={CELEBRATE_SPRING}
        style={{ transformOrigin: "40px 100px" }}
      />
      {/* right arm */}
      <motion.rect
        x="152"
        y="96"
        width="20"
        height="46"
        rx="10"
        fill="#46A302"
        animate={
          prefersReducedMotion
            ? undefined
            : { rotate: mood === "celebrate" ? 50 : 8 }
        }
        transition={CELEBRATE_SPRING}
        style={{ transformOrigin: "160px 100px" }}
      />

      {/* antenna */}
      <rect x="97" y="18" width="6" height="22" rx="3" fill="#46A302" />
      <motion.circle
        cx="100"
        cy="14"
        r="7"
        fill="#1CB0F6"
        animate={prefersReducedMotion ? undefined : { opacity: blink ? 0.4 : 1 }}
        transition={{ duration: 0.12 }}
      />

      {/* body */}
      <rect x="34" y="40" width="132" height="130" rx="42" fill="#58CC02" />
      <rect
        x="34"
        y="40"
        width="132"
        height="130"
        rx="42"
        fill="none"
        stroke="#46A302"
        strokeWidth="3"
      />

      {/* eyes */}
      <motion.g
        animate={prefersReducedMotion ? undefined : { scaleY: blink ? 0.1 : 1 }}
        transition={{ duration: 0.12 }}
        style={{ transformOrigin: "72px 92px" }}
      >
        <circle cx="72" cy="92" r="20" fill="white" />
        <circle cx="75" cy="94" r="9" fill="#3C3C3C" />
      </motion.g>
      <motion.g
        animate={prefersReducedMotion ? undefined : { scaleY: blink ? 0.1 : 1 }}
        transition={{ duration: 0.12 }}
        style={{ transformOrigin: "128px 92px" }}
      >
        <circle cx="128" cy="92" r="20" fill="white" />
        <circle cx="125" cy="94" r="9" fill="#3C3C3C" />
      </motion.g>

      {/* smile */}
      <path
        d="M74 132q26 22 52 0"
        stroke="#2E6E00"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* feet */}
      <rect x="60" y="168" width="24" height="14" rx="7" fill="#46A302" />
      <rect x="116" y="168" width="24" height="14" rx="7" fill="#46A302" />
    </motion.svg>
  );
}
