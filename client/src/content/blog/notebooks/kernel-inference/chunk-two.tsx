import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelSources } from "./sources";

function SharedPagesChunk() {
  return <>
    <p className="article-lead">Two requests can share a complete prompt page, but they may finish at different times. The first request to finish must not return memory that the second still needs.</p>
    <CommitSource source={kernelSources.two} />
    <ArticleNote>Chunk 2 adds reference counts, immutable-page metadata, and move-only ownership leases. This is C++17 CPU metadata: no KV payloads, request tables, CUDA operations, or performance measurements yet.</ArticleNote>

    <ArticleSection id="count-owners" title="Count owners separately from physical pages">
      <p>Part 1 returned an ID to the free list on release. That works for one owner. Sharing requires an allocation to start with one reference, a successful retain to add one, and release to reclaim physical capacity only when the last reference disappears.</p>
      <CodeBlock filename="One physical page, two owners">{`allocate        references = 1    occupied pages = 1
seal full page  references = 1    occupied pages = 1
retain          references = 2    occupied pages = 1
first release   references = 1    occupied pages = 1
last release    references = 0    occupied pages = 0`}</CodeBlock>
      <p><code>ReleaseResult::Released</code> now means one reference was released. It does not guarantee that a page became free. Pool statistics count physical pages; <code>inspect(handle)</code> reports the reference count and seal for an individual allocation.</p>
      <p>The metadata remains non-atomic under the existing single-owner-thread contract. Ordinary allocation, retain, inspection, and release do O(1) work; no latency benchmark was run.</p>
    </ArticleSection>

    <ArticleSection id="sealed-pages" title="Shared lifetime does not make shared writes safe">
      <p>Correct reference counts cannot prevent two requests from overwriting the same partial page. I chose a restrictive rule: only complete, sealed pages can be shared. Each request keeps its own writable tail.</p>
      <p><code>PagePool(capacity, tokens_per_page)</code> defines positive page geometry, defaulting to 16 tokens. For a four-token page, <code>seal_full(handle, 4)</code> seals it; declarations of zero, one, three, or five fail. Retain rejects an unsealed page, and sealing again reports <code>AlreadySealed</code> without adding an owner.</p>
      <p>A sealed page stays immutable even after its count falls back to one. Being the only remaining owner does not grant permission to rewrite a completed prefix. Final release frees it; a later allocation advances its generation and begins unsealed.</p>
      <ArticleNote>Sealing is a caller assertion about a full page. There are no payloads to inspect yet. It does not prove that tokens were written or prevent arbitrary writes through a future raw GPU pointer.</ArticleNote>
      <p>A prefix ending three tokens into its last page can share preceding full pages, while its partial tail stays private. Partial-page copy-on-write would need data copies and failure handling of its own, so it remains outside this chunk.</p>
    </ArticleSection>

    <ArticleSection id="owner-identity" title="The ownership trap a generation cannot catch">
      <p>A generation identifies one allocation lifetime, not each owner within it. Two owners intentionally share the same handle and generation. That exposes a manual-API limitation:</p>
      <CodeBlock filename="Why a second generation check is insufficient">{`A and B own {page 0, generation 7}; references = 2
A releases once;                        references = 1
A releases again;                       references = 0
// The count cannot distinguish A's mistake from B's release.`}</CodeBlock>
      <p>This is an anticipated contract problem, not a runtime bug found and fixed in these runs. Every successful allocate or retain needs exactly one release. Copying a handle creates no ownership. A registry of individual owners could detect more misuse, but would introduce another bookkeeping system.</p>
    </ArticleSection>

    <ArticleSection id="leases" title="Let one move-only lease own one reference">
      <p><code>PageLease</code> makes that obligation explicit through RAII: allocate or share through a factory, then release on reset or destruction. Copying is disabled. Moving transfers the reference without retaining, and the moved-from lease owns nothing.</p>
      <CodeBlock filename="Metadata-only sharing example">{`kvlab::PagePool pool(4, 16);  // Must outlive both leases.
auto first = kvlab::PageLease::try_allocate(pool);
if (!first) return;           // Capacity exhausted.
if (pool.seal_full(*first->handle(), 16) != kvlab::SealResult::Sealed)
  return;
auto second = first->try_share();
if (!second) return;
first->reset();               // Second owner still needs this page.
second->reset();              // Final release restores capacity.`}</CodeBlock>
      <p>The example only declares a full page; real writes come later. Factory construction and movement cannot throw after a successful retain, so wrapping the newly acquired reference cannot leak it.</p>
      <p>Move assignment must first release the destination's current reference. Tests cover both leases sharing the same page, leases from different pools, vector relocation, self-move, and exception unwinding. An optional may remain engaged after its lease is moved from; the lease's Boolean conversion tells whether it still owns a reference.</p>
      <p>The handle returned by a lease is borrowed. Manually releasing it would bypass the wrapper's ownership. The pool must outlive every lease, and destruction performs no GPU synchronization. RAII balances normal ownership; it cannot make arbitrary raw-handle misuse valid.</p>
    </ArticleSection>

    <ArticleSection id="validation" title="A review gap, then 32 recorded checks">
      <p>The first Debug run passed 31 checks. Manual contract review found missing coverage for the lease factory when retaining a saturated counter. I added a controlled overflow test, then validated the final 32-check suite. No allocator regression failed during those runs.</p>
      <p>A test-only fixture places a sealed page near the maximum 32-bit reference count. The real public retain operation reaches the maximum, rejects the next increment without mutation, and still permits a decrement. This avoids billions of artificial retains; the fixture restores its synthetic state before cleanup.</p>
      <p>Other focused checks cover immutable-page boundaries, all six finish orders for three owners, unchanged state on rejected shares, final-release reclamation, and stale handles after reuse.</p>
      <p>The sharing model runs 100 seeds with 10,000 decisions each. Its oracle derives counts from a list of logical owners, rather than mirroring the implementation's counter array. Those one million decisions supplement Part 1's 160,000 pool decisions.</p>
      <div className="article-table-scroll"><table>
        <caption>Recorded Chunk 2 correctness checks: 30 GoogleTests and two demos.</caption>
        <thead><tr><th>Configuration</th><th>Recorded result</th></tr></thead>
        <tbody>
          <tr><td>Clean Debug, Release, UBSan-only</td><td>32/32 passed in each configuration.</td></tr>
          <tr><td>Tests disabled</td><td>Library and both demos built; shared-prefix demo exited 0.</td></tr>
          <tr><td>ASan + UBSan</td><td>Not rerun; the Part 1 startup problem remains unresolved.</td></tr>
        </tbody>
      </table></div>
      <p>Repeated seeds across build modes are not independent new workload samples. Test durations and demo occupancy counts are not evidence of a speedup or measured KV-memory savings.</p>
    </ArticleSection>

    <ArticleSection id="reproduce" title="Reproduce Chunk 2">
      <p>Use the linked commit for this installment's exact code, then run from that checkout's root:</p>
      <CodeBlock filename="Debug build and shared-prefix demo">{`cmake --preset debug
cmake --build --preset debug --parallel 4
ctest --preset debug
./build/debug/shared_prefix_demo`}</CodeBlock>
      <p>The new <code>ubsan</code> preset captures Part 1's UBSan-only fallback. <code>release</code> selects an optimized correctness build. The existing <code>asan</code> preset still requests both sanitizers; its presence does not mean it passed.</p>
      <p>At the end of this chunk, sharing is page-level and explicitly selected. <a href="/blog/projects/llm-kernel-inference/chunk-3-request-transactions">Part 3</a> composes these leases into request tables, where a later failed allocation or retain must unwind earlier acquisitions. CPU reference count zero will still not establish GPU completion.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.two} />
  </>;
}

const chunkTwo: BlogUpdate = {
  slug: "chunk-2-shared-pages",
  title: "Part 2: Sharing pages without sharing writes",
  summary: "Reference counts, sealed full pages, and move-only leases. Why generation checks cannot identify individual owners, the overflow coverage gap caught in review, and 32 recorded correctness checks.",
  date: kernelSources.two.date,
  category: "Shared ownership",
  readingMinutes: 7,
  tags: ["C++17", "Reference counting", "RAII"],
  sections: [
    { id: "count-owners", title: "Owners and physical pages" },
    { id: "sealed-pages", title: "Sharing without shared writes" },
    { id: "owner-identity", title: "The ownership trap" },
    { id: "leases", title: "Move-only leases" },
    { id: "validation", title: "Review gap and recorded checks" },
    { id: "reproduce", title: "Reproduce Chunk 2" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: SharedPagesChunk,
};

export default chunkTwo;
