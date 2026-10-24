import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import SiteNavigation from "@/components/site-navigation";
import Footer from "@/components/footer";
import "./blog.css";

export default function BlogLayout({ title, children }: { title: string; children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — Billy Nguyen`;
    // Also honor a shared article URL with a section anchor on initial load.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => {
      cancelAnimationFrame(frame);
      document.title = previousTitle;
    };
  }, [location, title]);

  return (
    <div className="blog-shell min-h-screen bg-background">
      <a className="blog-skip" href="#blog-main">Skip to content</a>
      <SiteNavigation />
      <main id="blog-main" className="blog-main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
