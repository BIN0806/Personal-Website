import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelSources } from "./sources";

function SanitizerValidationChunk() {
  return <>
    <p className="article-lead">The local ASan executable still stalled before the allocator tests could run. Before changing allocator behavior, I needed to establish whether the build was instrumented and whether the host's detector could actually detect a known fault.</p>
    <CommitSource source={kernelSources.five} />
    <ArticleNote>Chunk 5 changes CPU validation infrastructure. The allocator and workload algorithms are unchanged. The follow-up records a completed Linux run while retaining the unresolved Mac startup failure.</ArticleNote>

    <ArticleSection id="boundaries" title="Separate instrumentation, runtime, and application behavior">
      <p>A successful configure does not establish that every source file has sanitizer flags. A crashing probe does not establish that the expected detector caused the crash. And a working detector does not establish that the allocator passes its suite. I made these three questions independently observable.</p>
      <p>ASan and UBSan now have separate CMake options and five explicit presets: Debug, Release, ASan, UBSan, and combined ASan/UBSan. Flags attach to project targets. The old combined option remains supported, but the <code>asan</code> preset now selects address instrumentation only; reproducing the old combination requires <code>asan-ubsan</code>.</p>
      <p>Test-enabled builds require Python 3.9 or newer. Previously, an optional Python dependency could silently remove the executable-output check. Tests-disabled library and benchmark builds still avoid that dependency.</p>
    </ArticleSection>

    <ArticleSection id="detector" title="Require a diagnostic-specific failure">
      <p>The flag audit independently enumerates first-party C++ sources and checks their compilation-database entries. Missing sources, missing or extra sanitizers, disabling overrides, and missing frame-pointer settings fail the audit. It does not inspect machine code or claim that GoogleTest internals are instrumented.</p>
      <p>A separate test executable first performs a valid allocation and must exit normally with its marker. It then deliberately crosses a heap bound for ASan or overflows a signed integer for UBSan. The parent accepts a fault only when the child exits unsuccessfully and emits the matching sanitizer diagnostic.</p>
      <CodeBlock filename="Detector acceptance rule — explanatory pseudocode">{`clean probe: exit 0 + expected marker
fault probe: nonzero exit + matching sanitizer diagnostic

timeout, generic crash, or recovered fault with exit 0 -> fail`}</CodeBlock>
      <p>Each child has a 20-second deadline, with command, return code, stdout, stderr, and timeout state retained. Regression fixtures exercise false-green outcomes without putting undefined behavior in the allocator. The deliberate faults belong only to the test probe.</p>
    </ArticleSection>

    <ArticleSection id="local-failure" title="The Mac failure remains an environment finding">
      <p>All five configurations compiled without warnings and passed flag audits. Local Debug and Release passed 69 checks each, and UBSan passed 70. ASan-only and combined clean probes still timed out after 20 seconds.</p>
      <p>I added a flushed marker at the beginning of <code>main</code>. Neither ASan mode reached it. That narrows the observed symptom to startup before that marker; it does not identify the exact initialization cause or prove the allocator guilty.</p>
      <p>UBSan's refined runtime, flag audit, and tooling regressions passed again. I retained the unsuccessful ASan records and moved the unchanged CPU suite to an independent Linux environment. Paying for GPU time would add no value to this CPU-only validation question.</p>
    </ArticleSection>

    <ArticleSection id="linux" title="The completed Linux matrix">
      <p>The implementation commit initially marked hosted execution pending. The evidence follow-up records <a href="https://github.com/BIN0806/GPU-Inference/actions/runs/40172396157">run 40172396157</a>, executed against implementation <code>a5041ec</code>:</p>
      <div className="article-table-scroll"><table>
        <caption>Ubuntu 24.04, GCC 13.3.0; completed October 25, 2026 in America/Los_Angeles.</caption>
        <thead><tr><th>Mode</th><th>Checks passed</th><th>Runtime preflight</th></tr></thead>
        <tbody>
          <tr><td>Debug / Release</td><td>69/69 each</td><td>No sanitizer selected.</td></tr>
          <tr><td>ASan</td><td>70/70</td><td>Clean allocation and expected heap diagnostic.</td></tr>
          <tr><td>UBSan</td><td>70/70</td><td>Clean allocation and expected overflow diagnostic.</td></tr>
          <tr><td>ASan + UBSan</td><td>70/70</td><td>Clean allocation and both expected faults.</td></tr>
        </tbody>
      </table></div>
      <p>All compilation audits and detector preflights passed before the full suite. Leak detection was enabled in Linux ASan jobs. No allocator fix or CI rerun was needed to obtain the pass. This closes the missing Linux execution gate for that source, while leaving the Mac issue unresolved.</p>
      <p>The workflow uses a pinned checkout, read-only access, bounded jobs, and standard public-repository runners. It uploads no artifacts. Branch protection was not configured, and the matrix supplies no thread-race, GPU-lifetime, or device-instrumentation coverage. Recorded spend remains $0.</p>
    </ArticleSection>

    <ArticleSection id="reproduce" title="Reproduce the instrumentation and runtime checks">
      <CodeBlock filename="Fresh ASan configuration at the Chunk 5 revision">{`cmake --fresh --preset asan
cmake --build --preset asan --parallel 2
python3 scripts/check_sanitizer_flags.py \\
  --source-dir . --build-dir build/asan --expected address
python3 tests/sanitizer_runtime_test.py build/asan/sanitizer_probe \\
  --sanitizers address --log-dir artifacts/chunk5-asan-preflight
ctest --preset asan --timeout 120`}</CodeBlock>
      <p>Use a fresh build tree when migrating from the older global UBSan flags, preserving any local settings first. Cached flags can otherwise add unexpected instrumentation; the audit rejects them instead of silently editing user options.</p>
      <p>The outcome is executed coverage on a recorded toolchain, not proof that every memory bug is absent. With that boundary established, <a href="/blog/projects/llm-kernel-inference/chunk-6-request-storage-reuse">Part 6</a> returns to the allocation cost exposed by the workload experiment.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.five} />
  </>;
}

const chunkFive: BlogUpdate = {
  slug: "chunk-5-sanitizer-validation",
  title: "Part 5: Proving the sanitizer can see",
  summary: "Separate build flags, runtime detection, and allocator behavior. Diagnostic-specific probes reject false passes; a five-mode Linux matrix supplies ASan coverage while the Mac startup problem stays unresolved.",
  date: kernelSources.five.date,
  category: "Validation & tooling",
  readingMinutes: 5,
  tags: ["ASan", "UBSan", "Linux CI"],
  sections: [
    { id: "boundaries", title: "Three validation boundaries" },
    { id: "detector", title: "Diagnostic-specific probes" },
    { id: "local-failure", title: "The local startup failure" },
    { id: "linux", title: "Completed Linux results" },
    { id: "reproduce", title: "Reproduce the checks" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: SanitizerValidationChunk,
};

export default chunkFive;
