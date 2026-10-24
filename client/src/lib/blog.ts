import type { ComponentType } from "react";

export interface BlogSection {
  id: string;
  title: string;
}

export interface BlogUpdate {
  /** Stable URL segment; keep it unchanged after sharing the link. */
  slug: string;
  title: string;
  summary: string;
  /** Calendar dates use YYYY-MM-DD, so ordering never depends on a timezone. */
  date: string;
  /** Last-modified date. Updating this moves the entry to its new position. */
  edited?: string;
  /** Progression category inside a setup, e.g. "Workflow plugins". */
  category?: string;
  readingMinutes: number;
  tags: string[];
  /** These IDs must match the section IDs in Content. */
  sections: BlogSection[];
  Content: ComponentType;
}

export interface BlogSetup {
  slug: string;
  title: string;
  description: string;
  /** Public settings repository, linked from the setup and all its posts. */
  repositoryUrl?: string;
  /** Categories are visible even before their first update is written. */
  categories: string[];
  updates: BlogUpdate[];
}

export interface BlogProject {
  slug: string;
  title: string;
  description: string;
  status: "In progress" | "Complete" | "On hold";
  tags: string[];
  sample?: boolean;
  updates: BlogUpdate[];
  /** Optional sub-notebooks. Productivity contains NVIM and Obsidian here. */
  setups?: BlogSetup[];
  /** Labels nested notebooks as projects; defaults to setup for Productivity. */
  childType?: "setup" | "project";
}

export function newestUpdates(project: { updates: BlogUpdate[] }): BlogUpdate[] {
  return [...project.updates].sort((a, b) => updateModifiedDate(b).localeCompare(updateModifiedDate(a)));
}

export function updateModifiedDate(update: BlogUpdate): string {
  return update.edited ?? update.date;
}

export function latestProjectDate(project: BlogProject): string {
  const latest = newestUpdates({ updates: allProjectUpdates(project) })[0];
  return latest ? updateModifiedDate(latest) : "";
}

export function allProjectUpdates(project: BlogProject): BlogUpdate[] {
  return [...project.updates, ...(project.setups ?? []).flatMap((setup) => setup.updates)];
}

export function latestSetupDate(setup: BlogSetup): string {
  const latest = newestUpdates(setup)[0];
  return latest ? updateModifiedDate(latest) : "";
}

export function newestSetups(project: BlogProject): BlogSetup[] {
  return [...(project.setups ?? [])].sort((a, b) => latestSetupDate(b).localeCompare(latestSetupDate(a)));
}

export function setupCategories(setup: BlogSetup): string[] {
  return Array.from(new Set([...setup.categories, ...setup.updates.flatMap((update) => update.category ? [update.category] : [])]));
}

export function newestProjects(projects: BlogProject[]): BlogProject[] {
  return [...projects].sort((a, b) => latestProjectDate(b).localeCompare(latestProjectDate(a)));
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function projectPath(project: BlogProject): string {
  return `/blog/${project.slug}`;
}

export function setupPath(project: BlogProject, setup: BlogSetup): string {
  return `${projectPath(project)}/${setup.slug}`;
}

export function updatePath(project: BlogProject, update: BlogUpdate, setup?: BlogSetup): string {
  return `${setup ? setupPath(project, setup) : projectPath(project)}/${update.slug}`;
}
