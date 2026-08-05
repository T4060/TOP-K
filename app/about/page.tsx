import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About — TOP-K",
  description: "The story behind TOP-K.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutContent />
    </main>
  );
}
