import type { Metadata } from "next";
import { DevNavbar } from "@/components/devhelp/dev-navbar";
import { TerminalPanel } from "@/components/devhelp/terminal-panel";
import { DevFooter } from "@/components/devhelp/dev-footer";

export const metadata: Metadata = {
  title: "Terminal — cmdline",
  description: "Describe what you're stuck on and get exact terminal commands, step by step.",
};

export default function TerminalPage({
  searchParams,
}: {
  searchParams: { ask?: string };
}) {
  return (
    <main>
      <DevNavbar />
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-paper px-6 pb-24 pt-40">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ink/50">
            Help me with this...
          </p>
          <h1 className="mt-4 font-display text-5xl italic leading-[1.02] tracking-tighter text-ink sm:text-6xl">
            Tell it what&apos;s broken.
          </h1>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink/60">
            Pick a suggestion or type your own — you&apos;ll get numbered
            steps with real, copyable commands.
          </p>
        </div>

        <TerminalPanel initialAsk={searchParams.ask} />
      </section>
      <DevFooter />
    </main>
  );
}
