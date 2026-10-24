import type { BlogProject } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";

// Temporary example project. Replace this file with your own project, or remove
// it when you no longer need the demo. See ../templates/project.template.tsx.
function ReadableUpdates() {
  return (
    <>
      <p className="article-lead">A finished project tells you what was built. A project journal tells you how it got there.</p>
      <p>This sample entry explores a place for the decisions, small experiments, and open questions that usually disappear between commits. The aim is to make each update useful on its own while keeping the larger story easy to follow.</p>

      <ArticleSection id="the-idea" title="The idea">
        {/* Start with the problem, why it matters, and the scope of this update. */}
        <p>A portfolio is a useful snapshot, but it leaves little room for the work between milestones. A journal can keep that context: what changed, why one approach was chosen, and what still needs work.</p>
        <p>The structure starts with a project. Each project holds dated entries. An entry focuses on one meaningful change, with enough detail for a reader to understand the decision and reproduce the experiment.</p>
        <ArticleNote>This is illustrative content for the blog layout. Replace it with your own project notes, code, screenshots, and measured results.</ArticleNote>
      </ArticleSection>

      <ArticleSection id="the-structure" title="From project to update">
        {/* Explain your architecture or approach. A diagram or screenshot can go here. */}
        <p>There are three levels to the journal. The project list gives an overview, the project notebook shows its history, and the article captures the details of one iteration.</p>
        <ol><li><strong>Projects:</strong> a short description of each thing being built.</li><li><strong>Updates:</strong> dated milestones, with the most recent at the top.</li><li><strong>Articles:</strong> the reasoning, implementation, and lessons behind a change.</li></ol>
        <p>Keeping dates in the left column makes the history easy to scan. A clear title does the rest: it should describe the actual change, rather than just say “Update 3.”</p>
      </ArticleSection>

      <ArticleSection id="implementation" title="A small implementation">
        {/* Use a focused code excerpt; explain the interesting decision around it. */}
        <p>A date can do two jobs: label an entry and establish its position in the notebook. With dates stored as <code>YYYY-MM-DD</code>, the list can sort newest first without depending on the order entries were written in the source file.</p>
        <CodeBlock filename="sort-updates.ts">{`type Entry = { title: string; date: string };

function newestFirst(entries: Entry[]) {
  // Copy before sorting to preserve the original collection.
  return [...entries].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}`}</CodeBlock>
        <p>The article itself can use ordinary paragraphs, headings, lists, and code. The contents list should match those headings so a reader can jump directly to the part they need.</p>
      </ArticleSection>

      <ArticleSection id="observations" title="What to check">
        {/* Replace this with actual observations. Include test conditions and units
            when reporting measurements; do not present placeholders as results. */}
        <p>A useful update describes how the change was evaluated. For a reading interface, that could mean checking navigation and readability. For a performance project, it could mean a reproducible benchmark with a fixed input and environment.</p>
        <div className="article-table-scroll"><table><caption>Example review plan — these are prompts, not measured results.</caption><thead><tr><th scope="col">Area</th><th scope="col">Question to answer</th></tr></thead><tbody><tr><td>Navigation</td><td>Can a reader get from the project to a specific update and back?</td></tr><tr><td>Chronology</td><td>Does a newly added entry appear in the right place?</td></tr><tr><td>Readability</td><td>Are paragraphs, code, and tables comfortable on a small screen?</td></tr><tr><td>Reproducibility</td><td>Is there enough context to repeat the experiment?</td></tr></tbody></table></div>
      </ArticleSection>

      <ArticleSection id="next-steps" title="What comes next">
        {/* End with unresolved questions and the next concrete experiments. */}
        <p>The next real entry can be smaller than this example. A short note about a bug, an unexpected result, or an approach that did not work is still useful documentation.</p>
        <ul><li>Replace this notebook with a real project and explain its starting point.</li><li>Add one focused update after each meaningful change.</li><li>Include screenshots or results when they help explain the work.</li></ul>
        <p>The layout takes inspiration from the readable technical write-ups in <a href="https://alex1xu.github.io/blog/flashattention-from-scratch/" target="_blank" rel="noreferrer">Alexander Xu’s FlashAttention article</a>: a clear narrative, concrete implementation details, and space for what remains unknown.</p>
      </ArticleSection>
    </>
  );
}

function ConnectingUpdates() {
  return (
    <>
      <p className="article-lead">One project, several milestones, and a stable link for each piece of the story.</p>
      <p>This earlier sample entry demonstrates a shorter update. An article does not need to cover the whole project; it can document a single design decision.</p>
      <ArticleSection id="context" title="The missing context"><p>When unrelated entries share one feed, it can be difficult to find the next chapter of a project. Grouping updates into a notebook gives a reader a place to start and a way to follow the history.</p></ArticleSection>
      <ArticleSection id="approach" title="Give each update a home"><p>Keep the project identity stable and give each update its own descriptive URL. Titles can improve over time while shared links continue to work.</p><CodeBlock filename="example-routes.txt">{`/blog
/blog/project-journal
/blog/project-journal/connecting-projects-and-updates`}</CodeBlock><p>Each article links back to the notebook and to its neighboring entries. A reader can move through the work in either direction.</p></ArticleSection>
      <ArticleSection id="tradeoffs" title="A deliberate tradeoff"><p>This example uses local content files. That keeps writing close to the project source and makes revisions visible in version control. It also means publishing a new entry requires rebuilding and deploying the site.</p><ArticleNote>A content editor or database could be added later if writing directly in a browser becomes useful. Neither is needed for the initial journal.</ArticleNote></ArticleSection>
      <ArticleSection id="next" title="Next step"><p>Build a comfortable reading layout and test it with paragraphs, code, and a small table. Those are the building blocks the next sample entry explores.</p></ArticleSection>
    </>
  );
}

function StartingSmall() {
  return (
    <>
      <p className="article-lead">Start with a place to keep the work, before deciding how polished the work should look.</p>
      <p>This is the first sample entry in the notebook. Use an opening entry to explain what you want to build and what you hope to learn.</p>
      <ArticleSection id="motivation" title="Why this project"><p>The idea is a running record of independent projects: not just the finished demo, but the questions, revisions, and small discoveries along the way.</p></ArticleSection>
      <ArticleSection id="first-milestone" title="The first milestone"><p>Keep the first version narrow enough to finish. For this sample project, that means a list of notebooks, a history of updates, and a readable page for each entry.</p><ul><li>Make it easy to discover a project.</li><li>Keep its history in one place.</li><li>Leave room for code and explanations when an entry needs them.</li></ul></ArticleSection>
      <ArticleSection id="open-questions" title="Open questions"><p>How much context should each entry repeat? When does an experiment deserve a separate article? These are questions to revisit as real projects accumulate.</p><p>The next entry explores how to connect the project and its updates.</p></ArticleSection>
    </>
  );
}

const project: BlogProject = {
  slug: "project-journal",
  title: "Building a project journal",
  description: "A home for the process behind the projects. Exploring how to document ideas, implementation details, and lessons as the work evolves.",
  status: "In progress",
  tags: ["Web development", "Design", "Learning in public"],
  sample: true,
  // Deliberately authored oldest first to demonstrate automatic date sorting.
  updates: [
    {
      slug: "starting-small",
      title: "Starting with a small, useful baseline",
      date: "2026-10-16",
      summary: "The starting point: what this journal is for, the first milestone, and the questions to keep open.",
      readingMinutes: 2,
      tags: ["Planning"],
      sections: [{ id: "motivation", title: "Why this project" }, { id: "first-milestone", title: "The first milestone" }, { id: "open-questions", title: "Open questions" }],
      Content: StartingSmall,
    },
    {
      slug: "connecting-projects-and-updates",
      title: "Connecting projects and their updates",
      date: "2026-10-20",
      summary: "Giving each project its own notebook and each milestone a permanent place in the story.",
      readingMinutes: 2,
      tags: ["Architecture", "Navigation"],
      sections: [{ id: "context", title: "The missing context" }, { id: "approach", title: "Give each update a home" }, { id: "tradeoffs", title: "A deliberate tradeoff" }, { id: "next", title: "Next step" }],
      Content: ConnectingUpdates,
    },
    {
      slug: "a-readable-home-for-every-update",
      title: "A readable home for every update",
      date: "2026-10-23",
      summary: "Bringing the journal together with a focused reading layout, code examples, and a clear path through each entry.",
      readingMinutes: 4,
      tags: ["Design", "Implementation"],
      sections: [{ id: "the-idea", title: "The idea" }, { id: "the-structure", title: "From project to update" }, { id: "implementation", title: "A small implementation" }, { id: "observations", title: "What to check" }, { id: "next-steps", title: "What comes next" }],
      Content: ReadableUpdates,
    },
  ],
};

export default project;
