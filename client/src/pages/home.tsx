import HeroSection from "@/components/hero-section";
import PortfolioSection from "@/components/portfolio-section";
import Footer from "@/components/footer";
import SiteNavigation from "@/components/site-navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Blog navigation can link directly to an existing portfolio section.
    const frame = requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavigation />

      <HeroSection />

      <PortfolioSection />
      <Footer />
    </div>
  );
}
