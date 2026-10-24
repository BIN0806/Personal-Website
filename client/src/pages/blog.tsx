import { useState } from "react";
import { Link, Redirect, type RouteComponentProps } from "wouter";
import { ArrowLeft, ArrowRight, ChevronRight, Github } from "lucide-react";
import BlogLayout from "@/components/blog/blog-layout";
import ProgressionFilter from "@/components/blog/progression-filter";
import { blogProjects } from "@/content/blog";
import { allProjectUpdates, formatBlogDate, latestProjectDate, latestSetupDate, newestSetups, newestUpdates, projectPath, setupPath, updateModifiedDate, updatePath, type BlogProject, type BlogSetup, type BlogUpdate } from "@/lib/blog";

function SampleNotice() {
  return <p className="blog-sample-note"><span>Starter content</span> These entries are illustrative and ready to replace with actual setup notes.</p>;
}

function Tags({ tags }: { tags: string[] }) {
  return <div className="blog-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>;
}

function SettingsLink({ setup }: { setup?: BlogSetup }) {
  if (!setup?.repositoryUrl) return null;
  return (
    <a
      href={setup.repositoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="blog-settings-link"
      aria-label={`View ${setup.title} on GitHub`}
    >
      <Github size={15} aria-hidden="true" />
      Settings on GitHub
    </a>
  );
}

function MissingEntry() {
  return <BlogLayout title="Entry not found"><div className="blog-intro"><p className="blog-eyebrow">404 / BLOG</p><h1>This entry isn't here.</h1><p>The project or update may have moved. Find the current entries in the blog.</p><Link href="/blog" className="blog-back"><ArrowLeft size={15} /> Back to all projects</Link></div></BlogLayout>;
}

// Preserve links created before NVIM and Obsidian became Productivity setups.
function legacySetupPath(slug: string): string | undefined {
  if (slug === "nvim-setup" || slug === "obsidian-setup") return `/blog/productivity/${slug}`;
}

export function BlogIndex() {
  return (
    <BlogLayout title="Blog">
      <header className="blog-intro">
        <p className="blog-eyebrow">THE BLOG / PROJECT JOURNAL</p>
        <h1>Projects</h1>
        <p>A record of what I'm building, what I'm learning, and the details along the way.<br />From Idea to Iteration</p>
      </header>
      <div className="blog-section-label"><h2>Project notebooks</h2><span>{String(blogProjects.length).padStart(2, "0")} {blogProjects.length === 1 ? "PROJECT" : "PROJECTS"}</span></div>
      <div className="blog-project-list">
        {blogProjects.map((project) => {
          const count = allProjectUpdates(project).length;
          return <Link href={projectPath(project)} key={project.slug} className="blog-project-row">
            <div className="blog-project-date"><span>Last modified</span>{latestProjectDate(project) && <time dateTime={latestProjectDate(project)}>{formatBlogDate(latestProjectDate(project))}</time>}</div>
            <div className="blog-project-info"><div className="blog-project-status"><span className={`blog-status-dot ${project.status === "In progress" ? "is-active" : ""}`} />{project.status}</div><h3>{project.title}</h3><p>{project.description}</p><Tags tags={project.tags} /></div>
            <div className="blog-project-meta">{Boolean(project.setups?.length) && <span>{project.setups!.length} {project.childType ?? "setup"}s</span>}<span>{count} {count === 1 ? "update" : "updates"}</span><span className="blog-open-project">Open notebook <ArrowRight size={17} aria-hidden="true" /></span></div>
          </Link>;
        })}
      </div>
      {!blogProjects.length && <p className="blog-empty">The first project notebook is on its way.</p>}
    </BlogLayout>
  );
}

export function BlogProjectPage({ params }: RouteComponentProps<{ projectSlug: string }>) {
  const legacyPath = legacySetupPath(params.projectSlug);
  if (legacyPath) return <Redirect to={legacyPath} />;
  const project = blogProjects.find((item) => item.slug === params.projectSlug);
  if (!project) return <MissingEntry />;
  const setups = newestSetups(project);
  return <BlogLayout title={project.title}>
    <Link href="/blog" className="blog-back"><ArrowLeft size={15} aria-hidden="true" /> All projects</Link>
    <header className="blog-intro blog-project-intro"><p className="blog-eyebrow">PROJECT NOTEBOOK / {project.status.toUpperCase()}</p><h1>{project.title}<span>.</span></h1><p>{project.description}</p><Tags tags={project.tags} /></header>
    {project.sample && <SampleNotice />}
    {setups.length > 0 && <>
      <div className="blog-section-label"><h2>{project.childType === "project" ? "Projects" : "Setups"}</h2><span>LAST MODIFIED</span></div>
      <div className="blog-setup-list" role="region" aria-label={`${project.title} notebooks`} tabIndex={setups.length > 5 ? 0 : undefined}>
        {setups.map((setup) => <Link className="blog-setup-row" key={setup.slug} href={setupPath(project, setup)}>
          <time dateTime={latestSetupDate(setup) || undefined}>{latestSetupDate(setup) ? formatBlogDate(latestSetupDate(setup)) : "No updates yet"}</time><span>{setup.title}</span><ArrowRight size={18} aria-hidden="true" />
        </Link>)}
      </div>
      {setups.length > 5 && <p className="blog-index-footnote">Scroll to explore more</p>}
    </>}
    {(project.updates.length > 0 || !setups.length) && <UpdateList project={project} updates={newestUpdates(project)} />}
  </BlogLayout>;
}

export function BlogEntryPage({ params }: RouteComponentProps<{ projectSlug: string; entrySlug: string }>) {
  const legacyPath = legacySetupPath(params.projectSlug);
  if (legacyPath) return <Redirect to={`${legacyPath}/${params.entrySlug}`} />;
  const project = blogProjects.find((item) => item.slug === params.projectSlug);
  if (!project) return <MissingEntry />;
  const setup = project.setups?.find((item) => item.slug === params.entrySlug);
  if (setup) return <SetupPage key={`${project.slug}/${setup.slug}`} project={project} setup={setup} />;
  return <BlogArticlePage params={{ projectSlug: params.projectSlug, updateSlug: params.entrySlug }} />;
}

function SetupPage({ project, setup }: { project: BlogProject; setup: BlogSetup }) {
  const [category, setCategory] = useState<string | null>(null);
  const updates = newestUpdates(setup).filter((update) => !category || update.category === category);
  return <BlogLayout title={`${setup.title} · ${project.title}`}>
    <Link href={projectPath(project)} className="blog-back"><ArrowLeft size={15} aria-hidden="true" /> Back to {project.title}</Link>
    <header className="blog-intro blog-project-intro">
      <p className="blog-eyebrow">{project.title.toUpperCase()} / {(project.childType ?? "setup").toUpperCase()} NOTEBOOK</p>
      <h1>{setup.title}<span>.</span></h1>
      <p>{setup.description}</p>
      <SettingsLink setup={setup} />
    </header>
    {project.sample && <SampleNotice />}
    <ProgressionFilter setup={setup} selected={category} onSelect={setCategory} />
    <UpdateList project={project} setup={setup} updates={updates} emptyMessage={category ? `No ${category.toLowerCase()} updates yet.` : undefined} />
  </BlogLayout>;
}

function UpdateList({ project, setup, updates, emptyMessage }: { project: BlogProject; setup?: BlogSetup; updates: BlogUpdate[]; emptyMessage?: string }) {
  return <>
    <div className="blog-section-label"><h2>Progression</h2><span>LAST MODIFIED</span></div>
    <div className="blog-update-list">
      {updates.map((update, index) => <Link href={updatePath(project, update, setup)} key={update.slug} className="blog-update-row">
        <div className="blog-update-date"><time dateTime={updateModifiedDate(update)}>{formatBlogDate(updateModifiedDate(update))}</time>{index === 0 && <span>Latest update</span>}</div>
        <div className="blog-update-info">{update.category && <span className="blog-update-category">{update.category}</span>}<h3>{update.title}</h3><p>{update.summary}</p><span className="blog-reading-time">{update.readingMinutes} min read <span aria-hidden="true">/</span> {update.tags.join(" · ")}</span></div>
        <ArrowRight className="blog-row-arrow" size={20} aria-hidden="true" />
      </Link>)}
    </div>
    {!updates.length && <p className="blog-empty">{emptyMessage ?? "The first update is coming soon."}</p>}
  </>;
}

export function BlogArticlePage({ params }: RouteComponentProps<{ projectSlug: string; setupSlug?: string; updateSlug: string }>) {
  const project = blogProjects.find((item) => item.slug === params.projectSlug);
  const setup = project?.setups?.find((item) => item.slug === params.setupSlug);
  if (!project || (params.setupSlug && !setup)) return <MissingEntry />;
  const updates = newestUpdates(setup ?? project);
  const index = updates.findIndex((item) => item.slug === params.updateSlug);
  const update = updates[index];
  if (!update) return <MissingEntry />;
  const Content = update.Content;
  const backPath = setup ? setupPath(project, setup) : projectPath(project);
  const contents = <ol>{update.sections.map((section, sectionIndex) => <li key={section.id}><a href={`#${section.id}`}><span>{String(sectionIndex + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>;

  return <BlogLayout title={update.title}>
    <nav className="blog-breadcrumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link><ChevronRight size={13} aria-hidden="true" /><Link href={projectPath(project)}>{project.title}</Link>{setup && <><ChevronRight size={13} aria-hidden="true" /><Link href={setupPath(project, setup)}>{setup.title}</Link></>}</nav>
    <div className="blog-article-grid">
      <article className="blog-article">
        <header className="blog-article-header">
          <p className="blog-eyebrow">{(setup?.title ?? project.title).toUpperCase()} / {(update.category ?? "PROJECT JOURNAL").toUpperCase()}</p>
          <h1>{update.title}</h1>
          <div className="blog-article-meta"><span>Billy Nguyen</span><span aria-hidden="true">·</span><time dateTime={update.date}>{formatBlogDate(update.date)}</time><span aria-hidden="true">·</span><span>{update.readingMinutes} min read</span></div>
          {update.edited && <p className="blog-edited">Edited <time dateTime={update.edited}>{formatBlogDate(update.edited)}</time></p>}
          <Tags tags={update.tags} />
          <SettingsLink setup={setup} />
        </header>
        {project.sample && <SampleNotice />}
        {update.sections.length > 0 && <details className="blog-mobile-contents"><summary>On this page</summary><nav aria-label="Article contents">{contents}</nav></details>}
        <div className="blog-prose"><Content /></div>
        <nav className="blog-article-pagination" aria-label="Other notebook updates"><UpdateLink project={project} setup={setup} update={updates[index + 1]} label="Older update" /><UpdateLink project={project} setup={setup} update={updates[index - 1]} label="Newer update" /></nav>
        <Link href={backPath} className="blog-back"><ArrowLeft size={15} aria-hidden="true" /> All {setup ? project.childType ?? "setup" : "project"} updates</Link>
      </article>
      {update.sections.length > 0 && <aside className="blog-contents"><nav aria-label="Article contents"><p>ON THIS PAGE</p>{contents}</nav><Link href={backPath} className="blog-back"><ArrowLeft size={13} aria-hidden="true" /> All updates</Link></aside>}
    </div>
  </BlogLayout>;
}

function UpdateLink({ project, setup, update, label }: { project: BlogProject; setup?: BlogSetup; update?: BlogUpdate; label: string }) {
  if (!update) return <div />;
  return <Link href={updatePath(project, update, setup)}><span>{label}</span><strong>{update.title}</strong><time dateTime={updateModifiedDate(update)}>{formatBlogDate(updateModifiedDate(update))}</time></Link>;
}
