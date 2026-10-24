import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import { Link, useLocation } from "wouter";

const sections = [
  { id: "about", label: "About Me", testId: "nav-about" },
  { id: "portfolio", label: "Projects", testId: "nav-portfolio" },
  { id: "self-learning", label: "Self-Learning", testId: "nav-self-learning" },
];

/** Keep the portfolio and blog navigation on the same layout and styles. */
export default function SiteNavigation() {
  const [location] = useLocation();
  const isHome = location === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = <div className="w-8 h-8 shrink-0 bg-primary rounded-lg flex items-center justify-center pixel-icon"><Code2 className="w-5 h-5 text-primary-foreground" /></div>;
  const sectionClass = "nav-link text-xs sm:text-sm font-medium text-muted-foreground transition-colors whitespace-nowrap";

  return <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-effect shadow-lg" : "bg-background/80 backdrop-blur-sm"}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {isHome
          ? <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 transition-opacity">{logo}</button>
          : <Link href="/" aria-label="Home" className="flex items-center gap-2 transition-opacity">{logo}</Link>}
        <div className="flex items-center gap-2 sm:gap-5 lg:gap-6">
          {sections.map((section) => isHome
            ? <button key={section.id} onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })} className={sectionClass} data-testid={section.testId}>{section.label}</button>
            : <Link key={section.id} href={`/#${section.id}`} className={sectionClass} data-testid={section.testId}>{section.label}</Link>)}
          <Link href="/blog" aria-current={location.startsWith("/blog") ? "page" : undefined} className="rounded-full border border-current px-3 py-1.5 text-xs sm:text-sm font-medium text-[var(--vintage-accent)] transition-colors hover:bg-[var(--vintage-accent)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" data-testid="nav-blog">Blog</Link>
        </div>
      </div>
    </div>
  </nav>;
}
