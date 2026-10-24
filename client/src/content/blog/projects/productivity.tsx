import type { BlogProject } from "@/lib/blog";
import nvim from "../setups/nvim-setup";
import obsidian from "../setups/obsidian-setup";

// This is one project with two setup notebooks. Add a setup to this array to
// create another tab; each setup keeps its own categories and dated updates.
const productivity: BlogProject = {
  slug: "productivity",
  title: "Productivity",
  description: "Building a better daily workflow through my NVIM and Obsidian setups. A record of the configuration, plugins, and habits as they evolve.",
  status: "In progress",
  tags: ["Developer tools", "Knowledge management"],
  sample: true, // The project is real; its starter entries are illustrative.
  updates: [],
  setups: [nvim, obsidian],
};

export default productivity;
