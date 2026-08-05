"use client";

import { AmbientCanvas } from "@/components/ambient-canvas";
import { MagneticButton } from "@/components/magnetic-button";
import { Stagger, StaggerItem } from "@/components/stagger";

export function AboutContent() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-paper px-6 py-40">
      <AmbientCanvas
        className="absolute inset-0 [mask-image:radial-gradient(90%_70%_at_50%_40%,white,transparent)]"
        color="#0a0a0a"
        maxOpacity={0.05}
        flickerChance={0.1}
        squareSize={3}
        gridGap={7}
      />
      <Stagger className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <StaggerItem>
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/60">
            About
          </p>
        </StaggerItem>

        <StaggerItem className="mt-6">
          <h1 className="font-display text-6xl italic leading-[0.98] tracking-tighter text-ink sm:text-7xl">
            A table, considered.
          </h1>
        </StaggerItem>

        <StaggerItem className="mt-6">
          <p className="max-w-xl font-sans text-lg leading-relaxed text-ink/70">
            TOP-K opened with one idea: that a kitchen and a dining room can be
            built with the same discipline as any well-made system — every
            course tuned, every detail deliberate. We source in small batches,
            change the tasting menu with the seasons, and keep the room quiet
            enough to hear the food.
          </p>
        </StaggerItem>

        <StaggerItem className="mt-10">
          <MagneticButton href="/reservations">Reserve a table</MagneticButton>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
