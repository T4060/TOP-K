"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { MagneticButton } from "@/components/magnetic-button";

export function DevNavbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <div className="flex w-full max-w-5xl items-center justify-between gap-6">
        <Link href="/learn" className="font-display text-xl italic text-ink">
          cmdline<span className="text-ink/40">/</span>
        </Link>

        <Menu setActive={setActive} className="hidden md:flex">
          <MenuItem setActive={setActive} active={active} item="Topics">
            <div className="flex flex-col gap-3">
              <HoveredLink href="/learn#setup">Environment setup</HoveredLink>
              <HoveredLink href="/learn#git">Git &amp; GitHub</HoveredLink>
              <HoveredLink href="/learn#debug">Debugging</HoveredLink>
              <HoveredLink href="/learn#ship">Shipping</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="How it works">
            <div className="flex flex-col gap-3">
              <HoveredLink href="/learn#how-it-works">Ask the terminal</HoveredLink>
              <HoveredLink href="/learn/terminal">Open the tool</HoveredLink>
            </div>
          </MenuItem>
          <Link
            href="/learn/terminal"
            className="font-sans text-sm text-ink/80 transition-colors duration-200 hover:text-ink"
          >
            Terminal
          </Link>
        </Menu>

        <MagneticButton href="/learn/terminal" size="sm" className="shrink-0">
          <span className="hidden sm:inline">Help me with this...</span>
          <span className="sm:hidden">Help me</span>
        </MagneticButton>
      </div>
    </header>
  );
}
