import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeatureGrid } from "@/components/feature-grid";
import { MenuCarousel } from "@/components/menu-carousel";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureGrid />
      <MenuCarousel />
    </main>
  );
}
