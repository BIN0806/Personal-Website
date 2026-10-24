import { ArticleSection } from "@/components/blog/article-blocks";

const repository = "https://github.com/BIN0806/GPU-Inference";

// Pin every installment to its own commit. Never use main for historical claims.
// Dates are the commit's calendar date in America/Los_Angeles.
export const kernelSources = {
  one: {
    sha: "f1b120ee807de78aaf07987754e75fcc1a8ec3eb",
    date: "2026-10-23",
    article: "docs/blogs/01-a-page-pool-before-a-gpu.md",
    validation: "docs/blogs/evidence/01-validation.md",
    files: [
      ["PagePool implementation", "src/allocator/page_pool.cpp"],
      ["Pool tests", "tests/page_pool_test.cpp"],
    ],
  },
  two: {
    sha: "675a8c729712ff1bdb73cb02e2f5dfde57cf6a61",
    date: "2026-10-23",
    article: "docs/blogs/02-sharing-pages-without-sharing-writes.md",
    validation: "docs/blogs/evidence/02-validation.md",
    files: [
      ["Sharing implementation", "src/allocator/page_pool.cpp"],
      ["PageLease implementation", "src/allocator/page_lease.cpp"],
      ["Ownership tests", "tests/page_lease_test.cpp"],
      ["Sharing tests and model", "tests/page_sharing_test.cpp"],
    ],
  },
  three: {
    sha: "5befbdfe44bcda7db883d6135927e98ac7ced3c2",
    date: "2026-10-23",
    article: "docs/blogs/03-request-tables-that-fail-atomically.md",
    validation: "docs/blogs/evidence/03-validation.md",
    files: [
      ["RequestState implementation", "src/allocator/request_state.cpp"],
      ["Failure-injection tests", "tests/request_state_test.cpp"],
      ["Multi-request model", "tests/request_model_test.cpp"],
      ["Initial compiler diagnostics", "docs/blogs/evidence/03-initial-debug-warnings.txt"],
    ],
  },
} as const;

type ChunkSource = (typeof kernelSources)[keyof typeof kernelSources];

export function CommitSource({ source }: { source: ChunkSource }) {
  return <p>Source revision: <a href={`${repository}/commit/${source.sha}`}><code>{source.sha.slice(0, 7)}</code> on GitHub</a>. This installment describes that commit's implementation and recorded checks.</p>;
}

export function ChunkSources({ source }: { source: ChunkSource }) {
  const fileUrl = (path: string) => `${repository}/blob/${source.sha}/${path}`;
  return <ArticleSection id="sources" title="Commit and supporting records">
    <p>This post is adapted from the article, code changes, and validation evidence in <a href={`${repository}/commit/${source.sha}`}>commit <code>{source.sha.slice(0, 7)}</code></a>. File links below stay pinned to that revision.</p>
    <ul>
      <li><a href={fileUrl(source.article)}>Original installment</a></li>
      <li><a href={fileUrl(source.validation)}>Validation record and raw test logs</a></li>
      {source.files.map(([label, path]) => <li key={path}><a href={fileUrl(path)}>{label}</a></li>)}
    </ul>
    <p>The first three commits reconstruct saved, validated development snapshots; their dates are publication dates for that history. The <a href={`${repository}/blob/${kernelSources.three.sha}/docs/COMMIT_HISTORY.md`}>history notes</a> explain the reconstruction and subsequent Debug checks. Original test records are preserved as historical evidence.</p>
  </ArticleSection>;
}
