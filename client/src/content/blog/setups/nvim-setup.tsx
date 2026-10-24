import type { BlogSetup } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";

function FirstSetup() {
  return (
    <>
      <p className="article-lead">A notebook for building a comfortable, repeatable Neovim workflow.</p>
      <ArticleNote>Starter content: replace these prompts and examples with your actual setup and observations.</ArticleNote>
      <ArticleSection id="goals" title="What the setup should do">
        {/* Explain your editing workflow, languages, and current friction points. */}
        <p>Use this section to describe what you want from your editor: quick navigation, useful language tooling, and a configuration you understand well enough to maintain.</p>
      </ArticleSection>
      <ArticleSection id="configuration" title="The starting configuration">
        {/* Replace this illustrative excerpt with your own configuration. */}
        <p>Keep a small excerpt of the configuration here and explain why each change matters to your workflow.</p>
        <CodeBlock filename="init.lua — illustrative starting point">{`-- Replace with the options you actually use.
vim.g.mapleader = " "
vim.opt.number = true

-- Document plugin choices and key mappings below.
-- Add one change at a time so its effect is clear.`}</CodeBlock>
      </ArticleSection>
      <ArticleSection id="observations" title="What worked and what did not">
        {/* Record your environment, what you tried, and actual results. */}
        <p>Add observations from using the setup in a real project. Note any keybinding conflicts, missing tools, or choices you want to reconsider.</p>
      </ArticleSection>
      <ArticleSection id="next" title="Next changes">
        <ul><li>Document the configuration files and how to reproduce the setup.</li><li>Add an update when a plugin, mapping, or workflow changes.</li></ul>
      </ArticleSection>
    </>
  );
}

// Add future entries to updates; the most recently modified appears first.
// Set an entry's `edited` date whenever you revise it.
const setup: BlogSetup = {
  slug: "nvim-setup",
  title: "NVIM setup",
  repositoryUrl: "https://github.com/BIN0806/nvim_settings",
  description: "Configuration, keybindings, and the small changes that shape my editing workflow.",
  categories: ["Workflow plugins", "Keybindings", "Configuration"],
  updates: [{
    slug: "starting-the-setup",
    title: "Starting with a minimal configuration",
    date: "2026-10-20",
    edited: "2026-10-21",
    category: "Configuration",
    summary: "A starting point for documenting editor choices, configuration, and the next improvements.",
    readingMinutes: 2,
    tags: ["Configuration"],
    sections: [
      { id: "goals", title: "What the setup should do" },
      { id: "configuration", title: "The starting configuration" },
      { id: "observations", title: "What worked and what did not" },
      { id: "next", title: "Next changes" },
    ],
    Content: FirstSetup,
  }, {
    slug: "workflow-plugins",
    title: "Adding plugins for the daily workflow",
    date: "2026-10-23",
    category: "Workflow plugins",
    summary: "A place to record each plugin, the problem it solves, and how it changes the editing workflow.",
    readingMinutes: 2,
    tags: ["Plugins", "Workflow"],
    sections: [{ id: "problem", title: "The workflow problem" }, { id: "plugins", title: "Plugins added" }, { id: "review", title: "What changed" }],
    Content: WorkflowPlugins,
  }, {
    slug: "keybinding-progression",
    title: "Making frequent actions easier to reach",
    date: "2026-10-22",
    category: "Keybindings",
    summary: "Track new mappings, the actions they replace, and any conflicts discovered along the way.",
    readingMinutes: 2,
    tags: ["Keybindings"],
    sections: [{ id: "mappings", title: "Mappings to document" }, { id: "lessons", title: "What to revisit" }],
    Content: KeybindingProgression,
  }],
};

function WorkflowPlugins() {
  return <>
    <p className="article-lead">Track the plugins added to the setup and the reasons for adding them.</p>
    <ArticleNote>Starter entry. Replace these prompts with your actual plugins and observations.</ArticleNote>
    <ArticleSection id="problem" title="The workflow problem"><p>Describe the repeated task or friction point that prompted this change. Include the previous workflow so the improvement has context.</p></ArticleSection>
    <ArticleSection id="plugins" title="Plugins added">
      {/* Add one subsection per plugin, with its repository link and config. */}
      <p>For each plugin, record its name, the job it does, installation details, and the configuration or mappings you changed.</p>
      <CodeBlock filename="plugin-notes.md">{`## Plugin name
- Purpose: the workflow problem it solves
- Source: link to the plugin repository
- Configuration: relevant settings and mappings
- Tradeoffs: startup cost, conflicts, or alternatives`}</CodeBlock>
    </ArticleSection>
    <ArticleSection id="review" title="What changed"><p>Record how the plugin behaved during real work, what helped, and what still needs adjustment. Add a new dated entry for the next iteration.</p></ArticleSection>
  </>;
}

function KeybindingProgression() {
  return <>
    <p className="article-lead">A running record of the shortcuts that make the setup easier to use.</p>
    <ArticleNote>Starter entry. Add your real mappings and results here.</ArticleNote>
    <ArticleSection id="mappings" title="Mappings to document"><p>Record the key combination, mode, action, and reason for each new mapping. Explain any default behavior it replaces.</p></ArticleSection>
    <ArticleSection id="lessons" title="What to revisit"><p>Note conflicts, difficult combinations, and mappings that did not become useful habits. Use the next update to document revisions.</p></ArticleSection>
  </>;
}

export default setup;
