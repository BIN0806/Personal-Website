import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { blogProjects } from "@/content/blog";
import { formatBlogDate, latestProjectDate, latestSetupDate, newestSetups, newestUpdates, projectPath, setupPath, updateModifiedDate, updatePath } from "@/lib/blog";
import ProgressionFilter from "./progression-filter";
import "./hero-blog-browser.css";

/** Five rows stay visible; further rows scroll with the scrollbar hidden. */
function BrowserList({ label, children, count }: { label: string; children: ReactNode; count: number }) {
  return <>
    <div className="hero-blog-list" role="region" aria-label={label} tabIndex={count > 5 ? 0 : undefined}>{children}</div>
    {count > 5 && <p className="hero-blog-scroll-hint">Scroll to explore more</p>}
  </>;
}

function ModifiedDate({ date }: { date: string }) {
  return date ? <time dateTime={date}>{formatBlogDate(date)}</time> : <span />;
}

export default function HeroBlogBrowser() {
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [setupSlug, setSetupSlug] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initialRender = useRef(true);
  const project = blogProjects.find((item) => item.slug === projectSlug);
  const setup = project?.setups?.find((item) => item.slug === setupSlug);
  const setups = project ? newestSetups(project) : [];
  const childType = project?.childType ?? "setup";
  const notebook = setup ?? project;
  const updates = notebook ? newestUpdates(notebook).filter((update) => !category || update.category === category) : [];
  const title = notebook?.title ?? "Blog";

  useEffect(() => {
    if (initialRender.current) { initialRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
  }, [projectSlug, setupSlug]);

  function goBack() {
    setCategory(null);
    if (setupSlug) setSetupSlug(null);
    else setProjectSlug(null);
  }

  return (
    <section className="hero-blog-browser" aria-label="Browse the blog">
      <div className="hero-blog-heading">
        {project && <button type="button" className="hero-blog-back" onClick={goBack} aria-label={`Back to ${setup ? project.title : "all projects"}`}><ArrowLeft size={14} aria-hidden="true" /><span>Back</span></button>}
        <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
      </div>

      {!project && <>
        <p className="hero-blog-description">Ideas behind Projects and things I find worth spending time on</p>
        <div className="hero-blog-update-label"><span>Last modified</span></div>
        <BrowserList label="Blog projects" count={blogProjects.length}>
          {blogProjects.map((item) => <button type="button" className="hero-blog-menu-row" key={item.slug} onClick={() => setProjectSlug(item.slug)}>
            <ModifiedDate date={latestProjectDate(item)} /><span>{item.title}</span><ChevronRight size={16} aria-hidden="true" />
          </button>)}
        </BrowserList>
        {!blogProjects.length && <p className="hero-blog-description">The first notebook is coming soon.</p>}
      </>}

      {project && setups.length > 0 && !setup && <>
        <p className="hero-blog-description">Choose a {childType} to explore its progression.</p>
        <div className="hero-blog-update-label"><span>Last modified</span></div>
        <BrowserList label={`${project.title} notebooks`} count={setups.length}>
          {setups.map((item) => <button type="button" className="hero-blog-menu-row" key={item.slug} onClick={() => { setSetupSlug(item.slug); setCategory(null); }}>
            <ModifiedDate date={latestSetupDate(item)} /><span>{item.title}</span><ChevronRight size={16} aria-hidden="true" />
          </button>)}
        </BrowserList>
      </>}

      {project && (setup || setups.length === 0) && <>
        <p className="hero-blog-description">{notebook?.description}</p>
        {setup && <ProgressionFilter setup={setup} selected={category} onSelect={setCategory} />}
        <div className="hero-blog-update-label"><span>Last modified</span></div>
        <BrowserList key={`${project.slug}/${setup?.slug}/${category}`} label={`${title} updates`} count={updates.length}>
          {updates.map((update) => <Link className="hero-blog-update-row" key={update.slug} href={updatePath(project, update, setup)}>
            <ModifiedDate date={updateModifiedDate(update)} /><span>{update.title}</span><ArrowRight size={15} aria-hidden="true" />
          </Link>)}
        </BrowserList>
        {!updates.length && <p className="hero-blog-description">{category ? `No ${category.toLowerCase()} updates yet.` : "The first update is coming soon."}</p>}
      </>}

      <Link className="hero-blog-footer-link" href={project ? (setup ? setupPath(project, setup) : projectPath(project)) : "/blog"}>
        {setup ? `Open full ${childType} notebook` : project ? "Open project notebook" : "All project notebooks"}<ArrowRight size={13} aria-hidden="true" />
      </Link>
    </section>
  );
}
