import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelFileUrl, kernelSources } from "./sources";

function CpuWorkloadsChunk() {
  return <>
    <p className="article-lead">The allocator can preserve ownership and still make poor use of a fixed pool. I needed a workload that exposed page waste, admission failures, and the host bookkeeping required to keep requests moving.</p>
    <CommitSource source={kernelSources.four} />
    <ArticleNote>Chunk 4 adds deterministic CPU replay, physical-page accounting, and the first measurements. KV byte totals are modeled from geometry; no KV payload or GPU memory is allocated. These results describe a synthetic CPU workload.</ArticleNote>

    <ArticleSection id="accounting" title="Count physical pages across every owner">
      <p>Summing each request's table would count a shared page more than once. The accounting pass instead takes the complete owner inventory, checks that every request belongs to the same pool, forms the union of physical pages, and reconciles those owners with the pool's reference counts. An incomplete inventory fails instead of producing a plausible but incorrect memory total.</p>
      <p>The report separates committed token slots, reserved but uncommitted slots, unused tail capacity, free pages, and pages held only by the retained prefix owner. That last category matters: a cached prefix consumes capacity even when no active request uses it.</p>
      <p>Checked arithmetic rejects geometry and sum overflow. Request-table PMR counters record allocation calls, live bytes, and peak bytes, including temporary candidate tables. They measure that allocator's host storage, rather than the process's entire heap or device memory.</p>
    </ArticleSection>

    <ArticleSection id="trace" title="Offer the same work to each policy">
      <p>The trace is generated before replay. It draws admissions, appends, finishes, and cancellations, each targeting a request slot. An admission to an occupied slot is skipped; an append to an idle slot is skipped. Capacity failures are reported separately. A failed admission releases any prefix references it acquired, and a failed append preserves the request for retry.</p>
      <p>The experiment fixes the pool at 4,096 token slots, with 32 request slots, prompts up to 1,024 tokens, and a 128-token retained prefix when sharing is enabled. It varies page size across 8, 16, 32, and 64 tokens and offered sharing across 0%, 50%, and 90%.</p>
      <p>Three trace seeds and three fresh-process repetitions per configuration produce 108 runs of 20,000 offered events. Runs execute serially in shuffled order. Repeating a seed adds timing observations; it does not create another independent capacity workload. The trace is a stress test, with no queue or model-serving latency implied.</p>
    </ArticleSection>

    <ArticleSection id="timer" title="The unexpected result: zero-duration operations">
      <p>The first 108-run sweep completed, but many event durations and the empty timer-control median were zero. One control histogram contained 6,621 zero samples and nonzero steps around 41–42 ns. Representing a duration in nanoseconds had not made the clock precise enough to resolve every operation.</p>
      <p>I kept that experiment, added zero counts and the full control histogram, and introduced a fresh whole-trace replay with only two clock reads. The resulting mean includes dispatch, PMR counters, checksum work, skips, and rejected events. It cannot be relabeled as successful-append latency, p99, or model tokens per second.</p>
      <p>A separate diagnostic pass still compares every event outcome with the timed pass. After the instrumentation change, all 108 capacity results and offered-trace hashes matched the earlier sweep. The changed output-contract test passed again in Debug, Release, and UBSan. The new timing boundary justified repeating the experiment; it did not improve the clock itself.</p>
      <ArticleNote>A zero sample means the work was unresolved at this measurement scale. Subtracting timer overhead would not recover the missing resolution.</ArticleNote>
    </ArticleSection>

    <ArticleSection id="results" title="Sharing changes both accepted work and metadata cost">
      <div className="article-table-scroll"><table>
        <caption>Selected medians from the <a href={kernelFileUrl(kernelSources.four, "docs/experiments/0002-cpu-allocator-screening.md")}>108-run CPU report</a>; nine runs per row.</caption>
        <thead><tr><th>Tokens/page</th><th>Offered sharing</th><th>Admission rejection</th><th>Table allocation calls</th><th>Mean sampled tail slack</th></tr></thead>
        <tbody>
          <tr><td>8</td><td>0%</td><td>56.31%</td><td>3,871</td><td>34.56 slots</td></tr>
          <tr><td>16</td><td>0%</td><td>56.49%</td><td>3,106</td><td>71.35 slots</td></tr>
          <tr><td>16</td><td>90%</td><td>43.54%</td><td>6,492</td><td>86.80 slots</td></tr>
          <tr><td>64</td><td>0%</td><td>59.71%</td><td>1,776</td><td>280.69 slots</td></tr>
        </tbody>
      </table></div>
      <p>At page size 16, sharing reduced median rejection while table allocations increased. More requests succeeded, and sharing itself required metadata transactions. This experiment does not isolate each contribution. Larger pages reduced table work but increased tail slack under these traces.</p>
      <p>Some faster-looking configurations rejected more work, so their aggregate timing difference is not an allocator speedup. One retained run measured 535.93 ns per offered event against its group's 84.84 ns median. The host was not isolated and the cause remains unresolved; the outlier stays in the public results.</p>
      <p>Charts report observed ranges, not confidence intervals. Measurements ran on ARM64 macOS with Apple Clang 17 and an unsanitized Release build. There was no pinned core, fixed clock, or exclusive-host guarantee, and these CPU observations cannot select a GPU page size.</p>
    </ArticleSection>

    <ArticleSection id="validation" title="Recorded checks and reproduction">
      <p>The complete 67-check suite passed in Debug, Release, and UBSan without compiler warnings: 63 GoogleTests, three demos, and one executable-output contract check. New model cases added 32,000 unshared and 8,000 shared transitions. At this chunk's revision, ASan startup was still unresolved and Linux CI had not run.</p>
      <CodeBlock filename="Build and run a CPU trace at the Chunk 4 revision">{`cmake --preset release
cmake --build --preset release --parallel 4
ctest --preset release
./build/release/allocator_bench --output artifacts/chunk4-smoke \\
  --events 20000 --seed 7 --pool-tokens 4096 --page-tokens 16 \\
  --slots 32 --max-tokens 1024 --prefix-tokens 128 --share-percent 50`}</CodeBlock>
      <p>Choose a new output directory for every run. The committed report links compact per-run data, source and binary hashes, and charts; full raw traces remain in local ignored artifacts. Exact reproduction depends on the recorded source hashes, not the pre-Chunk-4 base commit alone.</p>
      <p>I kept the existing allocator and used the allocation counts to motivate a separate table-growth comparison. First, <a href="/blog/projects/llm-kernel-inference/chunk-5-sanitizer-validation">Part 5</a> closes the missing Linux sanitizer execution gate. Recorded infrastructure spending remains $0.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.four} />
  </>;
}

const chunkFour: BlogUpdate = {
  slug: "chunk-4-cpu-workloads",
  title: "Part 4: Measuring page use and CPU workloads",
  summary: "Replay fixed traces, count shared physical pages once, and measure host metadata. The first sweep exposed zero-duration samples; a revised timing boundary preserved the capacity results and the outliers.",
  date: kernelSources.four.date,
  category: "CPU measurement",
  readingMinutes: 6,
  tags: ["Benchmarking", "Memory accounting", "Measurement limits"],
  sections: [
    { id: "accounting", title: "Physical-page accounting" },
    { id: "trace", title: "Comparable offered work" },
    { id: "timer", title: "The timer-resolution problem" },
    { id: "results", title: "Capacity and metadata tradeoffs" },
    { id: "validation", title: "Checks and reproduction" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: CpuWorkloadsChunk,
};

export default chunkFour;
