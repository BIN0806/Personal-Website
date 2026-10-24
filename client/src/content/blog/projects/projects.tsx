import type { BlogProject } from "@/lib/blog";
import llmKernelInference from "../notebooks/llm-kernel-inference";
import { llmInference, monkeyType, nolanAmc, pcap, resembleResearch } from "../notebooks/project-history";

// Reuses the nested notebook layout used by Productivity. Dates are derived
// from each notebook's latest work log; the array order does not control sorting.
// To add another project, create its notebook and include it in `setups` here.
const projects: BlogProject = {
  slug: "projects",
  title: "Projects",
  description: "The ideas, experiments, and engineering behind my projects and research. Each notebook follows the work as it evolves.",
  status: "In progress",
  tags: ["Engineering", "Research", "Open source"],
  childType: "project",
  updates: [],
  setups: [pcap, llmInference, monkeyType, resembleResearch, nolanAmc, llmKernelInference],
};

export default projects;
