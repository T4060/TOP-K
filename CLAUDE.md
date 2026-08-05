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
- **Named tiers in use on this project**, so components stay consistent
  instead of each inventing its own numbers:
  - `{ stiffness: 220, damping: 20 }` — fluid layout entrances: section
    scroll-reveals, shared-layout (`layoutId`) morphs, drag-release pans.
  - `{ stiffness: 280, damping: 18 }` — snappy interaction pop: button and
    card `whileHover`/`whileTap`, magnetic-follow tracking, any
    hover-driven `layout` size growth. This is the "instantly snap or
    pop" tier — reach for it on anything the user is directly pointing at
    or pressing.
  - Cursor-tracking ambient lights (see rule 2's magnetic-glow note) stay
    on a *softer* spring than either tier above (lower stiffness, added
    `mass`) so the light trails the cursor with visible inertia instead
    of snapping — the inertia is the point, not a bug to tune out.
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
  `layoutId` requires two rendered states of the *same logical element*
  (a trigger and its opened surface, a card and its expanded detail
  view) to morph between — it is not a substitute for a plain
  scroll-triggered entrance. A section or grid of cards staggering into
  view on scroll has no "before" element to morph from, so that stays a
  transform/opacity spring per rule 3; give grid items a bare `layout`
  prop (no `layoutId`) instead, so if the grid itself reflows (a card
  expands, the viewport resizes) its siblings glide into their new slots
  via FLIP rather than snapping.
- Every interactive element (button, link, input, menu item) has an
  explicit hover and active/pressed state — no bare default browser
  affordances.
- **Documented exception — hero cursor glow is metallic gold.** The hero
  section's full-bleed cursor-tracking light is gold (`#d4af37`-family),
  not paper-white. This is a deliberate, explicit exception to rule 4's
  two-tone system, scoped *only* to that one hero glow effect — it does
  not license gold anywhere else (buttons, text, borders, other
  sections' ambient canvases all stay ink/paper). Requested and
  confirmed directly by the user over the two-tone default.

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
- **Documented exception — the hero headline only is bold sans.** Every
  other display headline on the site (feature grid, about, reservations)
  stays the serif-italic Fraunces voice described above. The hero's `h1`
  alone is set in Inter at `font-black` instead, per an explicit user
  choice to match a punchier, high-impact reference over the serif
  default. Treat this as scoped to that one element, not a precedent for
  swapping the site's display face elsewhere.

## 5. Design fidelity & validation workflow

- **Figma translation**: when a Figma MCP connector is attached to the
  session, pull the source frame's spacing/type variables directly rather
  than eyeballing values, and translate them into Tailwind `clamp()`-based
  fluid scales and `tracking-*` utilities instead of hardcoding fixed px
  values. No Figma connector is attached to this project as of writing —
  flag that explicitly rather than fabricating a pull, and fall back to
  matching the given reference/spec by eye until one is connected.
- **Visual validation is mandatory, not optional**: after generating or
  editing markup for any visual component, run a headless Playwright
  screenshot pass (build → dev server → screenshot each interactive
  state — default, hover, open/active) before committing. Self-critique
  spatial alignment, spacing rhythm, and type-scale contrast against this
  file before pushing. There is no dedicated Playwright MCP tool in this
  environment; drive the globally-installed Playwright package directly
  (see prior commits for the pattern) rather than claiming a "server"
  that isn't there.
- **Motion orchestration**: a single-property linear opacity fade is not
  an acceptable entrance animation. Combine at least two spring-driven
  properties (e.g. `opacity` + `y`, or `opacity` + `scale`) per rule 1,
  and prefer staggering across siblings over animating them in lockstep.
  Panel-style containers (modals, feature cards, hero backdrops) should
  mask with a radial gradient or `backdrop-filter` rather than a
  hard-edged rectangle where that reads as more premium.

## 6. Viral TikTok visual constraints & formulas

From the @webloved viral design system — strict, literal formulas rather
than general adjectives:

- **Constraints over adjectives**: strict design restraint. Max of two
  colors, one typeface at two weights, and every single micro-interaction
  execution time stays strictly under 400ms. Nothing moves unless the
  user causes it.
- **The gentle float**: drive hero imagery or food graphics with a
  continuous sine wave, `y = amplitude * sin(time * speed)`, fed into the
  animation loop every frame so elements breathe fluidly instead of
  sitting dead on the canvas.
- **Infinite technical mesh**: a zero-image dot matrix background made
  from a single CSS `radial-gradient` tiled infinitely via
  `background-size` — deep technical structure at zero image-load cost.
- **Retina spatial tuning**: every custom canvas element maps explicitly
  to `canvas.width = W * devicePixelRatio`, scaled via `ctx.scale(dpr,
  dpr)`, to eliminate blur on high-density displays.

## Applying these rules

When pulling a component from the 21st MCP or writing one from scratch:
1. Check the component's transitions — convert any `ease`/`duration`
   animation on interactive state changes to a spring per rule 1, using
   the 220/20 or 280/18 named tier as appropriate rather than a new
   one-off number.
2. Add magnetic hover to primary buttons and `layoutId` morphing to any
   dropdown/modal/popover per rule 2 — but not to plain scroll-reveal
   entrances, which stay transform/opacity springs with a bare `layout`
   for reflow smoothing.
3. Confirm no animated property triggers layout; wrap scroll-driven
   effects in Lenis/Motion One per rule 3.
4. Confirm typography follows the serif-display + sans-body pairing and
   the tight layout geometry per rule 4, except the hero headline's
   documented bold-sans exception.
5. Run the Playwright screenshot pass on every visual state (default,
   hover, open/active), self-critique alignment/spacing/contrast, and
   only then build + push, per rule 5.

Do not merge a component that violates any of the above without a
comment explaining the exception.
