import type { BlogSetup } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";

function FirstSetup() {
  return (
    <>
      <p className="article-lead">A notebook for shaping a personal knowledge system in Obsidian.</p>
      <ArticleNote>Starter content: replace the example structure and prompts with your actual vault and workflow.</ArticleNote>
      <ArticleSection id="goals" title="What the vault is for">
        {/* Describe the notes you capture and how you want to find them later. */}
        <p>Use this section to explain the role of the vault: capturing ideas, keeping project context, and connecting what you learn across different subjects.</p>
      </ArticleSection>
      <ArticleSection id="structure" title="A starting structure">
        {/* Replace this example with your real folder structure or a screenshot. */}
        <p>Document the organization you actually use and the reason for each part. A small example makes the structure easier to understand.</p>
        <CodeBlock filename="example-vault/">{`Inbox/       # Notes waiting to be organized
Projects/    # Decisions and progress for active work
Learning/    # Concepts, references, and linked notes
Templates/   # Reusable starting points for new notes`}</CodeBlock>
      </ArticleSection>
      <ArticleSection id="workflow" title="The daily workflow">
        {/* Add capture/review habits, templates, and plugin choices here. */}
        <p>Describe how a new note moves from an initial thought to something useful later. Include links, templates, or screenshots where they clarify the process.</p>
      </ArticleSection>
      <ArticleSection id="next" title="What to revisit">
        <ul><li>Record which parts of the structure are useful in practice.</li><li>Add dated updates as templates, plugins, and review habits evolve.</li></ul>
      </ArticleSection>
    </>
  );
}

const setup: BlogSetup = {
  slug: "obsidian-setup",
  title: "Obsidian setup",
  repositoryUrl: "https://github.com/BIN0806/obsidian_settings",
  description: "Notes on my vault structure, templates, and a workflow for connecting ideas.",
  categories: ["Vault structure", "Templates", "Plugins & workflow"],
  updates: [{
    slug: "shaping-the-vault",
    title: "Giving the vault a starting structure",
    date: "2026-10-21",
    category: "Vault structure",
    summary: "An initial notebook for the organization and habits behind a personal knowledge system.",
    readingMinutes: 2,
    tags: ["Organization"],
    sections: [
      { id: "goals", title: "What the vault is for" },
      { id: "structure", title: "A starting structure" },
      { id: "workflow", title: "The daily workflow" },
      { id: "next", title: "What to revisit" },
    ],
    Content: FirstSetup,
  }],
};

export default setup;
