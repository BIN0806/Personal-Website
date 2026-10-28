import { ArticleSection } from "@/components/blog/article-blocks";
import { nolanSources } from "./provenance";

export { nolanSources };
type ResearchSource = (typeof nolanSources)[keyof typeof nolanSources];

export function ResearchRevision({ source }: { source: ResearchSource }) {
  return <p>Research snapshots: {source.commits.map((commit, index) => <span key={commit.sha}>{index > 0 ? " → " : ""}<code>{commit.sha.slice(0, 7)}</code></span>)}. <a href={source.url}>Read the commit and source records</a>.</p>;
}

export function ResearchSources({ source }: { source: ResearchSource }) {
  return <ArticleSection id="sources" title="Commits and research records">
    <p>This article follows a substantial stage of work in the local research repository. The <a href={source.url}>downloadable source record</a> includes full commit IDs, timestamps, selected committed documents/results, and SHA-256 hashes. It preserves the evidence used here without assuming a public repository URL.</p>
    <ul>{source.commits.map(commit => <li key={commit.sha}><code>{commit.sha.slice(0, 7)}</code> — {commit.subject}</li>)}</ul>
    <p>Records used:</p>
    <ul>{source.records.map(record => <li key={record.path}><code>{record.path}</code>{record.selection === "hash-only" ? " — implementation identity; source hash recorded" : record.selection === "full-text" ? "" : " — selected assessment sections"}</li>)}</ul>
  </ArticleSection>;
}
