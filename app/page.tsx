import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeatureGrid } from "@/components/feature-grid";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureGrid />
    </main>
  );
}
