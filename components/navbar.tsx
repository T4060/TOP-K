"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { MagneticButton } from "@/components/magnetic-button";

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <div className="flex w-full max-w-5xl items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-xl italic text-ink"
        >
          TOP-K
        </Link>

        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Design system">
            <div className="flex flex-col gap-3">
              <HoveredLink href="#typography">Typography</HoveredLink>
              <HoveredLink href="#motion">Motion</HoveredLink>
              <HoveredLink href="#color">Color</HoveredLink>
              <HoveredLink href="#layout">Layout</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Work">
            <div className="flex flex-col gap-3">
              <HoveredLink href="#case-studies">Case studies</HoveredLink>
              <HoveredLink href="#playground">Playground</HoveredLink>
              <HoveredLink href="#changelog">Changelog</HoveredLink>
            </div>
          </MenuItem>
          <Link
            href="#pricing"
            className="font-sans text-sm text-ink/80 transition-colors duration-200 hover:text-ink"
          >
            Pricing
          </Link>
        </Menu>

        <MagneticButton href="#get-started" size="sm">
          Get started
        </MagneticButton>
      </div>
    </header>
  );
}
