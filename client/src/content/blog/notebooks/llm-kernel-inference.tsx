import type { BlogSetup, BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";

// Adapted from this project's authored Chunk 01 post and its validation record:
// docs/blogs/01-a-page-pool-before-a-gpu.md and evidence/01-validation.md.
// Add later chunks as separate BlogUpdate entries; keep published slugs stable.
function PagePoolChunk() {
  return <>
    <p className="article-lead">A KV cache sounds like a GPU data structure. But its first ownership question is a CPU question: which pages are available, which have been assigned, and when is an assignment no longer valid?</p>
    <ArticleNote>Chunk 1 is implemented in C++17 and owns CPU metadata only. No model is loaded, no GPU is involved, and infrastructure spending is $0. The validation below is correctness evidence, not a performance benchmark.</ArticleNote>

    <ArticleSection id="why-cpu" title="A page pool before a GPU">
      <p>I started with a fixed-capacity pool of page IDs. It can allocate, detect exhaustion, reclaim IDs, and reject a stale handle after an ID has been reused. This is an allocation primitive for a future KV cache; it does not contain keys and values yet.</p>
      <p>Eventually, a physical page ID will select a group of token slots in a large GPU tensor, and a request's page table will map logical positions to those IDs. Assigning those groups does not require understanding floating-point data or attention. Keeping ownership separate lets me test it locally before renting a GPU.</p>
      <p>A page here is an application-defined unit, rather than an operating-system page or a CUDA virtual-memory mapping. With four pages, the demonstration looks like this:</p>
      <CodeBlock filename="Four-page pool">{`free IDs: [3, 2, 1, 0]
allocate -> 0
allocate -> 1
allocate -> 2
allocate -> 3
allocate -> no capacity`}</CodeBlock>
      <p>The initial order makes the demo readable. Allocation order is not part of the contract: callers should depend on uniqueness and validity.</p>
    </ArticleSection>

    <ArticleSection id="invariant" title="Start with an invariant">
      <ArticleNote>Every page is either allocated or appears exactly once in the free list.</ArticleNote>
      <p>Free pages plus allocated pages must equal capacity. A page cannot be both free and allocated, and returning it twice cannot increase capacity.</p>
      <p>The implementation uses two vectors: one for per-page state and a generation counter, and another for free IDs as a stack. Construction sizes the metadata and reserves enough free-list capacity for every ID. Ordinary allocation is a <code>pop_back()</code>; reclamation is a <code>push_back()</code>.</p>
      <p>A set would make membership explicit but add tree or hash machinery. A bitmap could reduce metadata space, but would need a strategy for finding free bits. A variable-size allocator would solve a broader problem. The vector stack gives this version a short correctness argument.</p>
      <p>Construction takes O(N) time and storage; ordinary allocate and release calls perform O(1) work. Those are algorithmic properties of the code, not measured latency results. The full invariant checker scans the pool and allocates temporary storage, so it is diagnostic code rather than part of that hot-path claim.</p>
    </ArticleSection>

    <ArticleSection id="handles" title="A page ID is not a lifetime">
      <p>A bounds check and a live/free flag are not enough. Imagine a caller receives page 0, releases it, and keeps a copy of the ID. Another allocation then receives page 0. If the old caller releases its copied ID, a plain live/free check would accept it and revoke somebody else's current allocation.</p>
      <p>This was an anticipated lifetime failure, not a bug discovered in an older implementation. I included the regression test in the first version and used a handle that identifies both the physical page and its allocation generation:</p>
      <CodeBlock filename="include/kvlab/page_pool.hpp">{`struct PageHandle {
  PageId id;
  std::uint64_t generation;
};`}</CodeBlock>
      <CodeBlock filename="Reusing an ID">{`page 0: free, generation 0
    -> allocated, generation 1
    -> free, generation 1
    -> allocated, generation 2

release({0, 1}) fails; {0, 2} is the current allocation.`}</CodeBlock>
      <p>A handle is a copyable token, not an RAII owner: destroying it releases nothing. It is valid only for the issuing pool while that pool exists. Two pools can issue identical numeric handles, so cross-pool provenance remains a caller precondition. The pool itself is noncopyable and nonmovable.</p>
      <p>Generation overflow throws before changing state instead of wrapping and potentially making an old token valid again. It should be treated as terminal for the pool; exhausting 64 bits through normal allocations is outside this test suite.</p>
    </ArticleSection>

    <ArticleSection id="rejected-operations" title="Rejected operations leave state unchanged">
      <p>Normal exhaustion returns <code>std::nullopt</code>. Invalid releases return an explicit result:</p>
      <CodeBlock filename="ReleaseResult">{`enum class ReleaseResult {
  Released, InvalidPage, NotAllocated, StaleHandle
};`}</CodeBlock>
      <p>The release path validates before mutating:</p>
      <CodeBlock filename="src/allocator/page_pool.cpp — release path">{`if (handle.id >= slots_.size()) {
  return ReleaseResult::InvalidPage;
}
auto& slot = slots_[handle.id];
if (!slot.allocated) {
  return ReleaseResult::NotAllocated;
}
if (slot.generation != handle.generation) {
  return ReleaseResult::StaleHandle;
}
free_ids_.push_back(handle.id);
slot.allocated = false;
return ReleaseResult::Released;`}</CodeBlock>
      <p>The valid release path can be <code>noexcept</code> because construction reserved space for every ID. An allocated page has no entry in the free list, so returning it cannot exceed that capacity, and copying its integer ID cannot throw. This relies on the invariant; arbitrary vector insertion is not generally nonthrowing.</p>
      <p>The constructor also rejects capacities outside the planned signed 32-bit GPU page-table range before attempting large allocations. The current ID is unsigned, while the future device table reserves −1 as an invalid sentinel. Large but representable capacities can still fail with an ordinary allocation exception.</p>
    </ArticleSection>

    <ArticleSection id="testing" title="Test behavior with a different representation">
      <p>The focused tests cover zero capacity, unique allocation, repeated exhaustion, reuse, arbitrary release order, duplicate release, invalid IDs, wrong generations, stale handles, never-allocated pages, and oversized capacity rejection.</p>
      <p>The seeded model test runs 16 seeds with 10,000 decision steps each: 160,000 decisions per run. Its reference uses a set of free IDs and a collection of live handles, rather than duplicating the implementation's stack. It checks that returned IDs were free, occupancy matches, generations increase after reuse, and releasing the remaining handles restores capacity.</p>
      <p>It periodically calls the full invariant checker and does not assume allocation order. Randomized steps supplement targeted tests; they do not establish exhaustive coverage, GPU safety, or concurrency correctness.</p>
      <div className="article-table-scroll">
        <table>
          <caption>Recorded Chunk 1 validation on an ARM64 Mac with Apple Clang 17, C++17, CMake, and Ninja.</caption>
          <thead><tr><th>Configuration</th><th>Recorded outcome</th></tr></thead>
          <tbody>
            <tr><td>Debug</td><td>12/12 CTest checks passed.</td></tr>
            <tr><td>Release</td><td>12/12 checks passed.</td></tr>
            <tr><td>UBSan only</td><td>12/12 checks passed with halt-on-error enabled.</td></tr>
            <tr><td>Tests disabled</td><td>Library and demo built without fetching GoogleTest; demo exited successfully.</td></tr>
            <tr><td>Combined ASan/UBSan</td><td>Compiled and linked; discovery timed out. ASan remains unvalidated.</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 12 CTest checks are 11 GoogleTest cases plus the demo. The project retains commands, output, environment details, and source hashes for the record. CTest execution durations are not allocator benchmarks.</p>
    </ArticleSection>

    <ArticleSection id="reproduce" title="Reproduce the first chunk">
      <p>From the project root, use a C++17 compiler, CMake 3.24 or newer, and Ninja. CUDA is not required:</p>
      <CodeBlock filename="Debug build and demo">{`cmake --preset debug
cmake --build --preset debug --parallel 4
ctest --preset debug
./build/debug/page_pool_demo`}</CodeBlock>
      <p>The first test-enabled configure downloads the project's SHA-256-pinned GoogleTest v1.17.0 archive. A local copy can be supplied with <code>-DKVLAB_GTEST_ARCHIVE=/absolute/path/to/archive.tar.gz</code>; its hash is checked too. A build configured with <code>-DBUILD_TESTING=OFF</code> needs no GoogleTest.</p>
      <CodeBlock filename="Release build">{`cmake --preset release
cmake --build --preset release --parallel 4
ctest --preset release`}</CodeBlock>
      <p>The separate <code>asan</code> preset enables AddressSanitizer and UndefinedBehaviorSanitizer together. It builds, but its tests have not completed successfully on this host:</p>
      <CodeBlock filename="Combined sanitizer check — unresolved on this host">{`cmake --preset asan
cmake --build --preset asan --parallel 4
ctest --preset asan`}</CodeBlock>
      <p>The executed UBSan-only fallback uses explicit compiler flags and disables the project's combined sanitizer option:</p>
      <CodeBlock filename="UBSan-only fallback">{`cmake -S . -B build/ubsan -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON -DKVLAB_SANITIZE=OFF '-DCMAKE_CXX_FLAGS=-fsanitize=undefined -fno-omit-frame-pointer' -DKVLAB_GTEST_ARCHIVE=/absolute/path/to/archive.tar.gz
cmake --build build/ubsan --parallel 4
UBSAN_OPTIONS=halt_on_error=1:print_stacktrace=1 ctest --test-dir build/ubsan --output-on-failure`}</CodeBlock>
      <p>The fallback archive path must point to the pinned local archive. Sanitizers are for correctness checks and will be disabled for future performance comparisons.</p>
    </ArticleSection>

    <ArticleSection id="sanitizer-startup" title="The unexpected problem: sanitizer startup">
      <p>The combined ASan/UBSan build compiled, but test discovery hung. The first attempt also showed a sandbox permission error; removing that restriction removed the permission diagnostic but did not resolve the timeout.</p>
      <p>I separated the allocator from the environment with a minimal program that only printed a message. Compiled with the same sanitizer combination, it also timed out before printing. The UBSan-only probe ran, and the full project then passed all 12 checks with UBSan alone.</p>
      <p>That reproduces the symptom without the allocator or GoogleTest. It points toward a local runtime or environment problem, but does not establish its precise cause. I kept the failed attempts in the record and did not change allocator code or raise a timeout to claim success.</p>
      <ArticleNote>ASan is still unresolved. A successful build is not a successful sanitizer run, and UBSan does not replace ASan's memory checks. The next chunk should carry this item forward and repeat ASan on a functioning host.</ArticleNote>
    </ArticleSection>

    <ArticleSection id="next" title="What this establishes—and what comes next">
      <p>This chunk establishes a bounded pool with understandable, tested transitions: allocation uniqueness, deterministic exhaustion, checked reclamation, and stale-handle rejection within the issuing pool's lifetime.</p>
      <p>Reference counts, request page tables, prefix sharing, transactional multi-page growth, KV payloads, and GPU memory are still planned. The pool is single-threaded and needs external serialization. There is no measured latency, throughput, or speedup result.</p>
      <p>Generation checks also do not prove that a GPU has stopped reading a page. A kernel may already hold its raw physical ID; future reclamation must wait for the relevant completion.</p>
      <p>Part 2 is planned to introduce reference counts and explicit sharing of immutable full pages. The next question to explain is why two requests can share a complete page but must not independently write the same tail—and why a zero reference count will still not be enough for immediate GPU reuse.</p>
    </ArticleSection>
  </>;
}

const chunkOne: BlogUpdate = {
  slug: "chunk-1-page-pool",
  title: "Part 1: A page pool before a GPU",
  summary: "The first implementation: a CPU page-ID pool with generation-tagged handles, explicit failure behavior, and recorded correctness checks. Includes the sanitizer startup problem and what remains unresolved.",
  date: "2026-10-23",
  category: "Allocator foundations",
  readingMinutes: 8,
  tags: ["C++17", "KV cache", "Memory ownership"],
  sections: [
    { id: "why-cpu", title: "A page pool before a GPU" },
    { id: "invariant", title: "Start with an invariant" },
    { id: "handles", title: "A page ID is not a lifetime" },
    { id: "rejected-operations", title: "Rejected operations" },
    { id: "testing", title: "Testing and recorded results" },
    { id: "reproduce", title: "Reproduce the first chunk" },
    { id: "sanitizer-startup", title: "The sanitizer startup problem" },
    { id: "next", title: "What comes next" },
  ],
  Content: PagePoolChunk,
};

const llmKernelInference: BlogSetup = {
  slug: "llm-kernel-inference",
  title: "LLM Kernel Inference",
  description: "Building inference components in small, explained increments: a CPU page pool first, then GPU kernels and paged decode.",
  categories: ["Allocator foundations"],
  updates: [chunkOne],
};

export default llmKernelInference;
