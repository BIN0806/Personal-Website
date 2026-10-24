import type { BlogSetup } from "@/lib/blog";
import { ArticleSection } from "@/components/blog/article-blocks";

// 1. Copy to ../setups/your-setup.tsx and write the setup's content here.
// 2. Import it in the owning project (see projects/productivity.tsx).
// 3. Add it to that project's setups array. It becomes a tab automatically.
// 4. Add dated entries to updates. `category` assigns the progression filter;
//    `edited` is the last-modified date and moves an updated entry up the list.
function FirstUpdate() {
  return <>
    <p className="article-lead">Explain what changed in your setup and why.</p>
    <ArticleSection id="changes" title="What changed">
      {/* Add relevant plugins, keybindings, configuration excerpts, or images. */}
      <p>Describe the change and the workflow problem it addresses.</p>
    </ArticleSection>
    <ArticleSection id="results" title="Results and next steps">
      {/* Record actual observations and the next concrete changes to try. */}
      <p>Explain what helped, any limitations, and what you want to improve next.</p>
    </ArticleSection>
  </>;
}

const setup: BlogSetup = {
  slug: "your-setup",
  title: "Your setup",
  description: "The workflow this setup is meant to improve.",
  // repositoryUrl: "https://github.com/your-username/your-settings",
  // Set once here to show a settings link on this setup and all its posts.
  categories: ["Configuration", "Workflow plugins", "Keybindings"],
  updates: [{
    slug: "first-update",
    title: "Starting the setup",
    summary: "What changed and why it matters.",
    date: "2026-10-23",
    // edited: "2026-10-24",
    category: "Configuration",
    readingMinutes: 2,
    tags: ["Getting started"],
    sections: [{ id: "changes", title: "What changed" }, { id: "results", title: "Results and next steps" }],
    Content: FirstUpdate,
  }],
};

export default setup;
