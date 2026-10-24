import { newestProjects, type BlogProject } from "@/lib/blog";

// Each .tsx file in projects/ exports one project. Adding a file automatically
// adds its row, project page, and update pages. No route edits are needed.
// templates/ is deliberately outside this glob and never appears on the site.
const modules = import.meta.glob<{ default: BlogProject }>("./projects/*.tsx", { eager: true });

export const blogProjects = newestProjects(Object.values(modules).map((module) => module.default));
