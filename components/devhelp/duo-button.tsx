"use client";

import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Duolingo's signature "chunky" button: a bright face sitting a few
 * pixels above a darker shadow layer, so a press reads as the face
 * sinking into its own shadow. The only animated property is the face's
 * `y` transform (rule 3) — the shadow itself never moves or resizes.
 * Primary CTAs (`magnetic`) also get rule 2's cursor-follow behavior on
 * the outer wrapper, composing independently with the press transform
 * on the inner face.
 */
const PRESS_SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;
const HOVER_SPRING = { type: "spring", stiffness: 400, damping: 24 } as const;
const MAGNET_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;

const COLOR_STYLES = {
  green: { face: "bg-duo-green", shadow: "bg-duo-green-dark", text: "text-white" },
  blue: { face: "bg-duo-blue", shadow: "bg-duo-blue-dark", text: "text-white" },
  gold: { face: "bg-duo-gold", shadow: "bg-duo-gold-dark", text: "text-duo-ink" },
  red: { face: "bg-duo-red", shadow: "bg-duo-red-dark", text: "text-white" },
  purple: { face: "bg-duo-purple", shadow: "bg-duo-purple-dark", text: "text-white" },
  white: {
    face: "border-2 border-duo-track bg-white",
    shadow: "bg-duo-track",
    text: "text-duo-ink",
  },
} as const;

const SIZE_STYLES = {
  sm: { pad: "px-5 py-2.5 text-sm", depth: 3 },
  md: { pad: "px-7 py-3.5 text-base", depth: 4 },
  lg: { pad: "px-9 py-4 text-lg", depth: 5 },
} as const;

type DuoButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  color?: keyof typeof COLOR_STYLES;
  size?: keyof typeof SIZE_STYLES;
  magnetic?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

export function DuoButton({
  children,
  href,
  onClick,
  color = "green",
  size = "md",
  magnetic = false,
  disabled = false,
  type = "button",
  className,
}: DuoButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNET_SPRING);
  const springY = useSpring(y, MAGNET_SPRING);

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (!magnetic || prefersReducedMotion || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const { face, shadow, text } = COLOR_STYLES[color];
  const { pad, depth } = SIZE_STYLES[size];

  const Face = href ? motion.create(Link) : motion.button;
  const faceProps = href ? { href, onClick } : { type, onClick, disabled };

  return (
    <motion.div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        magnetic && !prefersReducedMotion ? { x: springX, y: springY } : undefined
      }
      className={cn("relative inline-block", disabled && "opacity-50", className)}
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-x-0 bottom-0 rounded-2xl", shadow)}
        style={{ top: depth }}
      />
      <Face
        {...faceProps}
        whileHover={
          prefersReducedMotion || disabled ? undefined : { y: -2, transition: HOVER_SPRING }
        }
        whileTap={
          prefersReducedMotion || disabled
            ? undefined
            : { y: depth, transition: PRESS_SPRING }
        }
        className={cn(
          "relative z-10 block select-none rounded-2xl text-center font-duo-display font-bold tracking-wide",
          face,
          text,
          pad,
          disabled && "pointer-events-none"
        )}
      >
        {children}
      </Face>
    </motion.div>
  );
}
