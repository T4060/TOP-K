# TOP-K — Design Engineering Principles

This project follows Emil Kowalski's approach to interface and animation
engineering. Every UI component built here — whether hand-written or pulled
from the 21st MCP component library — must comply with the rules below.
Treat this file as a checklist during implementation and code review, not
just a style guide.

## 1. Animation: physics, not easing curves

- Default to spring-based motion, not `duration` + `ease` curves. In Framer
  Motion, use `type: "spring"` with tuned `stiffness` / `damping` rather
  than `easeInOut`, `linear`, etc.
- Starting point for most UI transitions (buttons, toggles, small
  reveals): `{ type: "spring", stiffness: 100, damping: 15 }`. Tune per
  component — snappier UI (e.g. tooltips, switches) can go stiffer
  (`stiffness: 300–500`, `damping: 25–30`); larger surfaces (modals,
  panels) should stay closer to the default so they feel weighted, not
  twitchy.
- Only reach for duration-based `tween` easing when a spring genuinely
  doesn't fit (e.g. looping/indeterminate animations). Justify the
  exception in a comment when it happens.

## 2. Interaction delight

- Primary/CTA buttons get a magnetic hover effect: the element subtly
  translates toward the cursor within a bounded radius, then springs back
  to rest on mouse leave. Use `translate`, not layout-affecting
  properties, and drive it with a spring, per rule 1.
- Dropdowns, popovers, and modals use shared layout morphing
  (`layoutId` in Framer Motion) so the trigger visually transforms into
  the opened surface instead of the surface just fading/popping in.
- Every interactive element (button, link, input, menu item) has an
  explicit hover and active/pressed state — no bare default browser
  affordances.

## 3. Smoothness & performance

- Wrap page/section scroll in a smooth-scrolling layer (Lenis or Motion
  One's scroll utilities) rather than relying on native scroll for any
  scroll-linked or scroll-triggered animation.
- Never animate layout-triggering properties (`width`, `height`, `top`,
  `left`, `margin`, etc.). Animate `transform` (`translate`, `scale`,
  `rotate`) and `opacity` only — these are the hardware-accelerated
  properties that stay off the main thread.
- If a component's size needs to change (e.g. an accordion), animate
  height via a measured `scaleY`/`translate` trick or `layout` /
  `layoutId` animation rather than raw `height` transitions.
- Respect `prefers-reduced-motion`: springs should collapse to instant or
  near-instant transitions when the user has reduced motion enabled.

## 4. Typography & layout

- Layout geometry should be tight and modern: deliberate spacing scale,
  no ad hoc margins, generous negative space balanced against dense
  content blocks.
- Editorial type pairing: large serif headlines/display type paired with
  a clean, neutral sans-serif for body copy and UI chrome. Don't mix more
  than these two type families in a single view.
- Headlines set at a noticeably larger, tighter `line-height` /
  `letter-spacing` than body text to read as "editorial," not default
  browser heading sizes.

## Applying these rules

When pulling a component from the 21st MCP or writing one from scratch:
1. Check the component's transitions — convert any `ease`/`duration`
   animation on interactive state changes to a spring per rule 1.
2. Add magnetic hover to primary buttons and `layoutId` morphing to any
   dropdown/modal/popover per rule 2.
3. Confirm no animated property triggers layout; wrap scroll-driven
   effects in Lenis/Motion One per rule 3.
4. Confirm typography follows the serif-display + sans-body pairing and
   the tight layout geometry per rule 4.

Do not merge a component that violates any of the above without a
comment explaining the exception.
