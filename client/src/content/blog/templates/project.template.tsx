import type { BlogProject, BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";

/**
 * NEW PROJECT
 * 1. Copy this file to ../projects/your-project.tsx.
 * 2. Replace the project metadata and firstUpdate below.
 * 3. Write your article in FirstUpdate. The site discovers the file automatically.
 *
 * NEW UPDATE
 * 1. Add a new content function (e.g. SecondUpdate) in your project file.
 * 2. Copy firstUpdate, give it a unique slug/date/title, and point Content at it.
 * 3. Add it to the project's updates array. Most recently modified appears first.
 * 4. When editing an existing entry, set its edited date to the modification date.
 *
 * No drafts are hidden automatically: everything inside projects/ is published.
 * Keep unfinished drafts in templates/ or outside projects/ until ready.
 */
function FirstUpdate() {
  return (
    <>
      {/* A short opening: what changed, why it matters, and what this entry covers. */}
      <p className="article-lead">Replace with a one- or two-sentence introduction.</p>

      {/* Each ID must also appear in firstUpdate.sections for the contents links. */}
      <ArticleSection id="context" title="Context and goal">
        <p>Explain the problem, the project's current state, and the goal of this update.</p>
      </ArticleSection>

      <ArticleSection id="approach" title="Approach">
        <p>Describe your design, alternatives considered, and why you chose this approach.</p>
        {/* Optional image: put assets in client/public/blog/your-project/.
        <figure>
          <img src="/blog/your-project/architecture.png" alt="Describe the diagram's information" loading="lazy" />
          <figcaption>Explain what the reader should notice.</figcaption>
        </figure>
        */}
      </ArticleSection>

      <ArticleSection id="implementation" title="Implementation">
        <p>Walk through the important changes. Include a focused excerpt and explain it.</p>
        <CodeBlock filename="example.ts">{`// Replace with a small, relevant code excerpt.
// Explain non-obvious decisions in comments.
const message = "Your project starts here";`}</CodeBlock>
      </ArticleSection>

      <ArticleSection id="results" title="Results and lessons">
        <p>Record what you tested, the environment, actual results, and any limitations.</p>
        <ArticleNote>Replace this note with an important caveat, unexpected result, or lesson.</ArticleNote>
        {/* Optional table: wrap wide tables in article-table-scroll for mobile.
        <div className="article-table-scroll">
          <table>
            <caption>Test configuration and units</caption>
            <thead><tr><th scope="col">Experiment</th><th scope="col">Result</th></tr></thead>
            <tbody><tr><td>Baseline</td><td>Your measured result</td></tr></tbody>
          </table>
        </div>
        */}
      </ArticleSection>

      <ArticleSection id="next-steps" title="Next steps">
        <ul><li>The next concrete change or experiment.</li><li>An unresolved question worth revisiting.</li></ul>
        {/* Add links to the source code, papers, or resources used in this update. */}
      </ArticleSection>
    </>
  );
}

const firstUpdate: BlogUpdate = {
  slug: "first-update", // Unique within this project; lowercase words with hyphens.
  title: "The first milestone",
  summary: "A one-sentence preview of what changed and why it matters.",
  date: "2026-10-23", // YYYY-MM-DD. Use the publication date, not a timestamp.
  // edited: "2026-10-24", // Last modified; controls sorting and left-column dates.
  readingMinutes: 3,
  tags: ["Getting started"],
  category: "Configuration", // Optional progression category within a setup.
  sections: [
    { id: "context", title: "Context and goal" },
    { id: "approach", title: "Approach" },
    { id: "implementation", title: "Implementation" },
    { id: "results", title: "Results and lessons" },
    { id: "next-steps", title: "Next steps" },
  ],
  Content: FirstUpdate,
};

const project: BlogProject = {
  slug: "your-project", // Unique across all projects. Keep stable after publishing.
  title: "Your project name",
  description: "What you are building, why, and what you hope to learn.",
  status: "In progress", // Also accepts "Complete" or "On hold".
  tags: ["Your topic", "Your tools"],
  updates: [firstUpdate],
  // For a project with setup tabs, import setup objects and add `setups: [...]`.
  // See setup.template.tsx and projects/productivity.tsx. Use updates: [] when
  // all entries belong to the setups instead of directly to the project.
};

export default project;
