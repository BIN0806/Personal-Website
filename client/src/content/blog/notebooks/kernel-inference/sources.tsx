import { ArticleSection } from "@/components/blog/article-blocks";

const repository = "https://github.com/BIN0806/GPU-Inference";

interface ChunkSource {
  sha: string;
  date: string;
  followUp?: string;
  reconstructed?: boolean;
  // A third tuple item pins a later evidence record to its own commit.
  files: readonly (readonly [label: string, path: string, ref?: string])[];
}

// Pin implementation and evidence separately; never cite mutable main.
// Dates use America/Los_Angeles. The first three IDs follow the history cleanup.
export const kernelSources = {
  one: {
    sha: "3d4f690061a7e36c992313bd6b14bd35218c24bc",
    date: "2026-10-23",
    reconstructed: true,
    files: [
      ["Engineering log and recorded checks", "docs/ENGINEERING_LOG.md"],
      ["Page-pool design", "docs/decisions/0002-first-page-pool-contract.md"],
      ["PagePool implementation", "src/allocator/page_pool.cpp"],
      ["Pool tests", "tests/page_pool_test.cpp"],
    ],
  },
  two: {
    sha: "b3ffc58d08619de16d12114dc4fd612891522b1d",
    date: "2026-10-23",
    reconstructed: true,
    files: [
      ["Engineering log and recorded checks", "docs/ENGINEERING_LOG.md"],
      ["Sealed-page and lease design", "docs/decisions/0003-sealed-pages-and-leases.md"],
      ["Sharing implementation", "src/allocator/page_pool.cpp"],
      ["PageLease implementation", "src/allocator/page_lease.cpp"],
      ["Ownership tests", "tests/page_lease_test.cpp"],
      ["Sharing tests and model", "tests/page_sharing_test.cpp"],
    ],
  },
  three: {
    sha: "8b3bd7531f744784a02399be0a91c8ff9edf185b",
    date: "2026-10-23",
    reconstructed: true,
    files: [
      ["Engineering log, recorded checks, and compiler finding", "docs/ENGINEERING_LOG.md"],
      ["Request transaction design", "docs/decisions/0004-request-transactions.md"],
      ["RequestState implementation", "src/allocator/request_state.cpp"],
      ["Failure-injection tests", "tests/request_state_test.cpp"],
      ["Multi-request model", "tests/request_model_test.cpp"],
    ],
  },
  four: {
    sha: "94ee2973597c015629bf8618c49c941862d4d2ef",
    date: "2026-10-24",
    files: [
      ["CPU experiment report and recorded validation", "docs/experiments/0002-cpu-allocator-screening.md"],
      ["Per-run results", "docs/experiments/data/0002-runs.csv"],
      ["Measurement provenance", "docs/experiments/data/0002-provenance.json"],
      ["Benchmark and accounting contract", "docs/BENCHMARKS.md"],
      ["Physical-memory accounting", "src/allocator/memory_accounting.cpp"],
      ["Replay and output tests", "tests/benchmark_output_test.py"],
    ],
  },
  five: {
    sha: "a5041ece6e01c559161c354474239bad22ab4928",
    date: "2026-10-25",
    followUp: "7e820180a242b39a2a2082f6a28a395d207fef7d",
    files: [
      ["Completed local and Linux validation", "docs/VALIDATION.md", "7e820180a242b39a2a2082f6a28a395d207fef7d"],
      ["Sanitizer design decision", "docs/decisions/0006-sanitizer-validation.md"],
      ["Compilation flag audit", "scripts/check_sanitizer_flags.py"],
      ["Runtime detector checks", "tests/sanitizer_runtime_test.py"],
      ["Five-mode Linux workflow", ".github/workflows/cpu-ci.yml"],
    ],
  },
  six: {
    sha: "d0ad3a8b459fa52ce1cfa16964a7b783b485eafb",
    date: "2026-10-25",
    followUp: "05611b773b065973115096b9d8d50542fb043b8d",
    files: [
      ["Paired experiment and final plot review", "docs/experiments/0003-request-table-growth.md", "05611b773b065973115096b9d8d50542fb043b8d"],
      ["All 54 paired observations", "docs/experiments/data/0003/pairs.csv"],
      ["Completed Linux checks", "docs/VALIDATION.md", "05611b773b065973115096b9d8d50542fb043b8d"],
      ["Suffix-rollback implementation", "src/allocator/request_state.cpp"],
      ["Growth and failure regressions", "tests/request_state_test.cpp"],
      ["Comparison runner", "scripts/compare_allocator_variants.py"],
    ],
  },
  seven: {
    sha: "e76e02b602eacfca184e1a9dff0fb7c9a25d8061",
    date: "2026-10-25",
    followUp: "b2a970f681da619b69b512c7e4dd1b7e0e05998d",
    files: [
      ["Numerical contract and cross-host results", "docs/RMSNORM.md", "b2a970f681da619b69b512c7e4dd1b7e0e05998d"],
      ["Local per-case CPU results", "docs/validation/0007-rmsnorm-cpu.json"],
      ["Linux metrics and job links", "docs/validation/0007-linux-ci.json", "b2a970f681da619b69b512c7e4dd1b7e0e05998d"],
      ["Independent scalar oracle", "python/kvlab/oracle.py"],
      ["Eager PyTorch reference", "python/kvlab/reference.py"],
      ["Preflight contract and execution limits", "docs/GPU_PREFLIGHT.md"],
      ["Engineering log and setup findings", "docs/ENGINEERING_LOG.md", "b2a970f681da619b69b512c7e4dd1b7e0e05998d"],
    ],
  },
} as const satisfies Record<string, ChunkSource>;

export function kernelFileUrl(source: ChunkSource, path: string, ref = source.sha) {
  return `${repository}/blob/${ref}/${path}`;
}

export function CommitSource({ source }: { source: ChunkSource }) {
  return <p>Source revision: <a href={`${repository}/commit/${source.sha}`}><code>{source.sha.slice(0, 7)}</code> on GitHub</a>.{source.followUp ? <> Completed evidence and final review: <a href={`${repository}/commit/${source.followUp}`}><code>{source.followUp.slice(0, 7)}</code></a>.</> : <> This installment describes that commit's implementation and recorded checks.</>}</p>;
}

export function ChunkSources({ source }: { source: ChunkSource }) {
  return <ArticleSection id="sources" title="Commit and supporting records">
    <p>This post follows the implementation and engineering records in <a href={`${repository}/commit/${source.sha}`}>commit <code>{source.sha.slice(0, 7)}</code></a>{source.followUp ? <> and the <a href={`${repository}/commit/${source.followUp}`}>evidence follow-up <code>{source.followUp.slice(0, 7)}</code></a></> : null}. Each file below is pinned to the revision that supports it.</p>
    <ul>
      {source.files.map(([label, path, ref]) => <li key={path}><a href={kernelFileUrl(source, path, ref)}>{label}</a></li>)}
    </ul>
    {source.reconstructed && <p>The first three implementation revisions reconstruct saved, validated snapshots. The <a href={kernelFileUrl(kernelSources.seven, "docs/COMMIT_HISTORY.md", kernelSources.seven.followUp)}>history notes</a> explain their provenance and unchanged implementation after history cleanup.</p>}
  </ArticleSection>;
}
