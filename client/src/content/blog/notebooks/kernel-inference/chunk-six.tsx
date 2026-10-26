import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelFileUrl, kernelSources } from "./sources";

function RequestStorageChunk() {
  return <>
    <p className="article-lead">The first request transaction rebuilt its entire table at every page boundary. That made rollback easy to explain, but the workload measurements showed how often it paid for host allocations and moves.</p>
    <CommitSource source={kernelSources.six} />
    <ArticleNote>Chunk 6 reuses request-table storage and measures it against a frozen baseline. Logical ownership and physical KV accounting stay equivalent. Reduced allocation work comes with higher retained host memory and a measured regression in one workload.</ArticleNote>

    <ArticleSection id="growth" title="Use the new suffix as the transaction">
      <p>The candidate-table design allocated a complete replacement before acquiring pages and moving old owners. The new implementation grows the existing PMR vector geometrically, then treats only its new suffix as provisional.</p>
      <ol>
        <li>Reject insufficient physical capacity before allocating host storage.</li>
        <li>Reserve bounded host capacity with checked doubling.</li>
        <li>Append empty lease entries and acquire the additional pages.</li>
        <li>On failure, pop the provisional suffix and release its acquisitions.</li>
        <li>Publish the reserved length only after every acquisition succeeds.</li>
      </ol>
      <p>Lease moves, default construction, and destruction are nonthrowing, with compile-time assertions guarding that assumption. Relocating the vector therefore preserves existing ownership. Sharing a prefix and resource-sensitive move assignment keep their earlier candidate-table transactions.</p>
      <CodeBlock filename="Suffix cleanup — excerpt from request_state.cpp">{`const auto rollback = [&]() noexcept {
  while (pages_.size() > old_size) pages_.pop_back();
};`}</CodeBlock>
      <p>With spare table capacity, a request can cross a physical-page boundary without allocating host metadata. Reset can retain the vector's storage for the next request using that slot.</p>
    </ArticleSection>

    <ArticleSection id="rollback" title="Make retained capacity part of the contract">
      <p>A successful host reserve may be followed by a failed physical-page acquisition. Rollback preserves old handles, lengths, seals, references, and free physical capacity, but the larger host vector capacity can remain. Generation advances and free-list order remain outside the rollback guarantee, as before.</p>
      <p>Tests inject failure at every new suffix position while an existing shared prefix remains alive. They verify unchanged logical state, returned physical capacity, retained host storage, and a retry that needs no further host allocation. Other regressions cover logarithmic growth allocations, storage reuse after reset, and pool rejection before host allocation.</p>
      <p>Calling the no-allocation timing group “within page” had become incorrect: crossing a page no longer necessarily allocated metadata. I renamed the reporting labels to describe whether a PMR allocation occurred, preserving the raw C++ schema and timing boundary.</p>
    </ArticleSection>

    <ArticleSection id="experiment" title="Accept timing only after equivalent work matches">
      <p>I built and froze an unsanitized Release baseline from <code>7e82018</code> before editing the allocator. Baseline and candidate use byte-identical C++ workload and benchmark code. The comparison runner rejects mismatched traces, outcomes, or sampled physical-memory rows before accepting a pair.</p>
      <p>The experiment runs 54 adjacent pairs: three page sizes, two offered sharing settings, three seeds, and three repetitions. Pair order and within-pair variant order are randomized. Every run offers 20,000 events against the same 4,096-token-slot budget. All 54 pairs matched every event outcome and sampled physical accounting row.</p>
      <p>Timing comes from whole-trace replay with two clock reads. It includes dispatch, metadata resource counters, skips, and rejected work, and excludes trace construction, diagnostics, file output, and drain. This is mean time per offered CPU event, not append p99 or GPU decode time. The Apple M3 Pro host had no pinned core or exclusive-load guarantee.</p>
    </ArticleSection>

    <ArticleSection id="results" title="Fewer allocations, more retained bytes, one regression">
      <div className="article-table-scroll"><table>
        <caption>Selected results from <a href={kernelFileUrl(kernelSources.six, "docs/experiments/0003-request-table-growth.md", kernelSources.six.followUp)}>EXP-0003</a>. Counters are medians; time is the median of paired candidate/baseline ratios.</caption>
        <thead><tr><th>Page size / sharing</th><th>PMR calls: baseline → candidate</th><th>Retained host bytes</th><th>Paired time ratio</th></tr></thead>
        <tbody>
          <tr><td>8 / 0%</td><td>3,871 → 106</td><td>36,288 → 135,768</td><td>0.703</td></tr>
          <tr><td>16 / 0%</td><td>3,106 → 102</td><td>18,288 → 70,608</td><td>0.754</td></tr>
          <tr><td>16 / 90%</td><td>6,492 → 5,216</td><td>17,304 → 24,096</td><td>0.878</td></tr>
          <tr><td>64 / 90%</td><td>4,917 → 4,792</td><td>4,032 → 4,872</td><td>1.018</td></tr>
        </tbody>
      </table></div>
      <p>At page size 16 without sharing, allocation calls fell about 96.7% and the median paired time fell about 24.6%. Retained table storage rose about 3.86×. Those bytes are measured after owners drain and before table destruction; they are neither process RSS nor device memory.</p>
      <p>Five of six configurations had a lower median whole-trace time. The page-size-64, 90%-sharing case regressed: every observed ratio was between 1.001 and 1.025, with median 1.018. I retained that result instead of hiding it in an overall average.</p>
      <p>The unchanged prefix-sharing transaction limits reuse when sharing dominates. Reduced PMR work is a plausible explanation for improvements, but the experiment does not isolate allocator overhead, relocation, branches, or cache effects. The small regression remains unprofiled. Physical live pages, modeled KV bytes, and tail slack were identical within each pair, so this is no claim of improved KV capacity.</p>
    </ArticleSection>

    <ArticleSection id="review" title="A chart assumption caught during final review">
      <p>The runner accepts configurable seed and repeat counts, but the chart subtitle still hard-coded the default counts. Final review caught that display bug. The follow-up derives the observation count from the CSV and regenerates the chart.</p>
      <p>The measured C++ code, comparison logic, pair table, tests, and workflow did not change in that follow-up. The plot metadata fix is recorded separately from the timing evidence, so the presentation change cannot be mistaken for a new measurement run.</p>
    </ArticleSection>

    <ArticleSection id="validation" title="Validation, reproduction, and the decision">
      <p>Local Debug and Release passed 73 checks each, and UBSan passed 74. The completed <a href="https://github.com/BIN0806/GPU-Inference/actions/runs/40232916754">Linux run 40232916754</a> passed 73/73 in Debug and Release and 74/74 in all three sanitizer modes. Detector preflights and compilation audits passed; no allocator change or CI rerun was needed. The Mac's ASan startup problem remains unresolved.</p>
      <CodeBlock filename="Compare separate frozen Release binaries">{`python3 scripts/compare_allocator_variants.py \\
  --baseline /path/to/frozen-baseline/allocator_bench \\
  --candidate build/release/allocator_bench \\
  --baseline-source-manifest /path/to/baseline-source-sha256.json \\
  --output artifacts/chunk6-comparison`}</CodeBlock>
      <p>Keep each executable's CMake cache, compilation database, and source manifest with its build. Use a new output directory; the runner preserves failed and incomplete runs. The committed pair CSV contains all observations, while full per-event artifacts remain local.</p>
      <p>I kept storage reuse for the lab's growth-heavy workloads and retained the baseline for memory-sensitive comparisons. No workload-specific dispatcher is justified by six configurations. <a href="/blog/projects/llm-kernel-inference/chunk-7-rmsnorm-contract">Part 7</a> moves to the numerical contract for residual + RMSNorm before any device implementation. Spending remains $0.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.six} />
  </>;
}

const chunkSix: BlogUpdate = {
  slug: "chunk-6-request-storage-reuse",
  title: "Part 6: Growing request tables with suffix rollback",
  summary: "Reuse geometric host storage while preserving logical rollback. A 54-pair experiment records fewer allocations, increased retained memory, a high-sharing regression, and a chart-label fix caught in final review.",
  date: kernelSources.six.date,
  category: "Request transactions",
  readingMinutes: 6,
  tags: ["C++17", "Paired experiments", "Memory tradeoffs"],
  sections: [
    { id: "growth", title: "The suffix transaction" },
    { id: "rollback", title: "Retained capacity and rollback" },
    { id: "experiment", title: "Equivalent paired work" },
    { id: "results", title: "Measured tradeoffs and regression" },
    { id: "review", title: "The chart review finding" },
    { id: "validation", title: "Checks and reproduction" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: RequestStorageChunk,
};

export default chunkSix;
