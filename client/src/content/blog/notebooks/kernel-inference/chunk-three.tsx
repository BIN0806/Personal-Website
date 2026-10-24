import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelSources } from "./sources";

function RequestTablesChunk() {
  return <>
    <p className="article-lead">Allocating one page correctly is only the beginning. If a request needs three more pages and the second acquisition fails, what happens to its old table, its length, and the page it just acquired?</p>
    <CommitSource source={kernelSources.three} />
    <ArticleNote>Chunk 3 implements CPU request tables, reservation and commitment, transactional growth, and explicit full-prefix sharing. It still has no KV payloads, GPU execution, or measured performance result. Recorded infrastructure spending remains $0.</ArticleNote>

    <ArticleSection id="reservation" title="Reserved space is not readable data">
      <p><code>RequestState</code> owns an ordered table of Part 2's move-only leases. It tracks <code>reserved_length</code> for prepared capacity and <code>length</code> for tokens the caller declares committed. Allocating space cannot silently make a token readable.</p>
      <CodeBlock filename="Page size 4: reserve nine tokens, commit five">{`reserve_for_length(9)
  table: [A, B, C]
  reserved = 9; committed = 0
  token_location(0) -> no location

commit_length(5)
  A: four committed tokens, sealed
  B: one committed token, unique writable tail
  C: reserved but uncommitted, unique and writable
  reserved = 9; committed = 5`}</CodeBlock>
      <p>For a committed position, division selects the logical page and remainder selects the offset. The table then provides its physical handle. Positions at or beyond committed length have no token location, even if their storage is reserved. A borrowed <code>page_handle(i)</code> can inspect reserved entries without transferring ownership.</p>
      <p>Commitment is a caller assertion that data has been materialized. It neither writes K/V nor waits for a future GPU operation. Ordering writes and readers remains a separate integration requirement.</p>
    </ArticleSection>

    <ArticleSection id="arithmetic" title="Even page-count arithmetic needs a boundary test">
      <p>The usual ceiling-division expression can overflow while adding the rounding term. With a positive page size, the implementation avoids that addition:</p>
      <CodeBlock filename="src/allocator/request_state.cpp — page_count_for">{`return tokens / page_tokens + (tokens % page_tokens != 0);`}</CodeBlock>
      <p>A small pool rejects a reservation for <code>SIZE_MAX</code> tokens without wrapping the count. Another boundary case uses a theoretical <code>SIZE_MAX</code>-token page with one metadata entry; it does not allocate an enormous KV tensor. Prefix multiplication is bounded by the source's already representable committed length.</p>
    </ArticleSection>

    <ArticleSection id="transaction" title="Publish growth only after acquisition succeeds">
      <p>Appending directly to the live table would expose partial progress if a later acquisition failed. Instead, I stage a complete candidate table and keep the old request untouched until all throwing work has finished:</p>
      <ol>
        <li>Check whether enough physical pages are currently free.</li>
        <li>Allocate candidate host metadata with empty lease entries.</li>
        <li>Acquire new pages into their final candidate positions.</li>
        <li>Move the existing leases into the candidate after acquisition succeeds.</li>
        <li>Swap tables and publish the new reserved length.</li>
      </ol>
      <p>A failed candidate destroys its temporary leases. Successful publication uses nonthrowing lease moves and a swap between tables using the same memory resource. The free-page precheck handles ordinary exhaustion early, but cannot eliminate host-allocation failure or generation exhaustion during acquisition.</p>
      <p>This implementation favors a short correctness argument. Crossing a page boundary allocates metadata for the entire target table and moves the old owners: O(total target pages) work and temporary storage. Repeated one-page growth can accumulate quadratic host work. Growth within an already allocated page only updates a scalar. An append journal or reserved metadata capacity may help later, but there is no latency claim before measurement.</p>
    </ArticleSection>

    <ArticleSection id="rollback" title="Rollback preserves the request, not every pool byte">
      <p>The guarantee preserves existing handles, both lengths, and ownership. It also returns temporary pages to free capacity. It deliberately does not rewind generations or restore free-list order.</p>
      <p>A deterministic test forces the second prospective allocation to hit generation exhaustion. The first new page is acquired, the second throws, and candidate destruction releases the first. The original request is unchanged and capacity returns, while the briefly allocated page keeps its advanced generation.</p>
      <ArticleNote>Rolling a generation backward could make an old handle valid again. Allocation order was never part of the public contract. Restoring those internal details would be a different, unsafe promise.</ArticleNote>
      <p>The terminal condition is injected through a test-only fixture and restored for cleanup. It is not a naturally encountered allocator defect or permission for production callers to reset counters.</p>
    </ArticleSection>

    <ArticleSection id="commit-and-share" title="Commit and prefix sharing have their own preflight">
      <p>Reservation never shrinks. Commitment rejects a smaller committed length or a target beyond reservation. Before sealing anything, it checks every page touched by the newly committed range for unique writable ownership. It then seals newly completed pages and publishes the length under the single-threaded contract.</p>
      <p>A defensive test externally seals a later reserved page. Commit rejects the operation before sealing an earlier one. That deliberately violates the borrowed-handle boundary to check preflight; normal callers must not manually retain, release, or seal request-owned pages.</p>
      <p>Sharing requires an empty destination attached to the exact same pool and enough complete committed source pages. With nine tokens and page size four, a source can share eight tokens across two pages. The one-token tail stays private:</p>
      <CodeBlock filename="Explicit complete-prefix sharing">{`request A: [shared page 0, shared page 1, private tail A]
request B: [shared page 0, shared page 1, private tail B]`}</CodeBlock>
      <p>Prefix sharing also stages a candidate. A test saturates the second source page's count: retaining the first succeeds, retaining the second fails, and candidate destruction undoes the first retain. The destination stays empty; source handles and lengths stay unchanged.</p>
      <p>This composes explicitly selected pages. It does not discover matching prompts or prove their payloads equal. Automatic prefix lookup, copy-on-write, and eviction policies remain future work.</p>
    </ArticleSection>

    <ArticleSection id="failure-injection" title="Make allocation failure reproducible">
      <p>Waiting for the machine to run out of RAM would produce an unreliable test. A C++17 <code>std::pmr::vector</code> lets a request use a memory resource that can fail its next storage allocation. The fixture affects that table, leaves the test framework alone, and tracks outstanding bytes through cleanup.</p>
      <p>This exposes a subtle move-semantics choice. Move construction transfers the table and can be <code>noexcept</code>. Move assignment keeps the destination's memory resource, so it first prepares candidate storage with that resource. An allocation failure leaves both requests unchanged. After success, ownership transfers and the old destination's leases are released.</p>
      <p>Move assignment may therefore throw. Tests use distinct resources and pools rather than assuming allocators are interchangeable. Both the resource and pool are borrowed and must outlive the request. Cancellation or exception unwinding releases the request's prefix references and private reservations while preserving other owners.</p>
    </ArticleSection>

    <ArticleSection id="compiler-finding" title="The actual finding: three test-code warnings">
      <p>The first Debug run passed all 52 checks but produced three <code>[[nodiscard]]</code> warnings. Exception assertions invoked status-returning methods inside <code>EXPECT_THROW</code> without consuming their results.</p>
      <p>I made the intentional discard explicit with <code>static_cast&lt;void&gt;(...)</code> inside those assertions. Production methods keep <code>[[nodiscard]]</code>, preserving the warning for ordinary callers who ignore a failure status. The initial diagnostic is retained in the linked evidence; final clean builds were warning-free.</p>
      <p>This was a test-code fix. The recorded executions did not uncover an allocator regression or UBSan finding. Injected allocation and retain failures demonstrate the guarantees under test, rather than documenting failures that occurred in normal use.</p>
    </ArticleSection>

    <ArticleSection id="validation" title="52 checks and a multi-request model">
      <p>Focused cases cover lengths 0, 1, P−1, P, P+1, and 2P+1; hidden reservation; address translation; capacity failure and retry; metadata allocation failure; partial acquisition and retain rollback; moves; cancellation; and extreme integer arithmetic.</p>
      <p>The new model runs four requests through 32 seeds and 2,000 decisions each. It tracks expected tables and lengths, derives reference counts from logical owners, and compares occupancy and sealed state after each decision. Its 64,000 decisions join the earlier pool and sharing models for 1,224,000 generated decisions per complete suite.</p>
      <div className="article-table-scroll"><table>
        <caption>Recorded Chunk 3 validation: 49 GoogleTests and three demos.</caption>
        <thead><tr><th>Configuration</th><th>Recorded result</th></tr></thead>
        <tbody>
          <tr><td>Clean Debug</td><td>52/52 passed; warning-free build.</td></tr>
          <tr><td>Clean Release</td><td>52/52 passed; warning-free build.</td></tr>
          <tr><td>Clean UBSan-only</td><td>52/52 passed with halt-on-error; warning-free build.</td></tr>
          <tr><td>Tests disabled</td><td>Library and all three demos built; request demo exited 0.</td></tr>
          <tr><td>ASan + UBSan</td><td>Not rerun; the earlier host-startup issue remains open.</td></tr>
        </tbody>
      </table></div>
      <p>Fixed seeds repeated across build modes do not create independent new samples. These are CPU correctness results, with no allocator benchmark, GPU test, or CI run claimed for the installment.</p>
    </ArticleSection>

    <ArticleSection id="reproduce" title="Reproduce Chunk 3 and the next question">
      <p>At this installment's linked revision, run:</p>
      <CodeBlock filename="Debug build and request-state demo">{`cmake --preset debug
cmake --build --preset debug --parallel 2
ctest --preset debug
./build/debug/request_state_demo`}</CodeBlock>
      <p>The demo reserves nine tokens, commits them, shares an eight-token prefix, and gives each request an independent tail. It then checks that failed growth leaves the request unchanged and retries after reclaiming capacity. <code>release</code> and <code>ubsan</code> select the other validated configurations.</p>
      <p>The next chunk is CPU workload measurement and memory/waste accounting. Before moving toward GPU kernels, I need evidence about candidate-table growth costs and fragmentation. ASan validation also remains unresolved. Metadata commitment and CPU reference counts still cannot establish that an asynchronous GPU reader has finished.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.three} />
  </>;
}

const chunkThree: BlogUpdate = {
  slug: "chunk-3-request-transactions",
  title: "Part 3: Request tables that fail atomically",
  summary: "Separate reserved capacity from committed tokens, stage growth and prefix sharing before publication, and test rollback with deterministic failures. Includes the PMR move-assignment tradeoff and the compiler warnings fixed along the way.",
  date: kernelSources.three.date,
  category: "Request transactions",
  readingMinutes: 9,
  tags: ["C++17", "Exception safety", "Request ownership"],
  sections: [
    { id: "reservation", title: "Reservation and readable data" },
    { id: "arithmetic", title: "Page-count arithmetic" },
    { id: "transaction", title: "One publication point" },
    { id: "rollback", title: "What rollback preserves" },
    { id: "commit-and-share", title: "Commit and prefix sharing" },
    { id: "failure-injection", title: "Reproducible allocation failure" },
    { id: "compiler-finding", title: "The compiler warning fix" },
    { id: "validation", title: "52 checks and the request model" },
    { id: "reproduce", title: "Reproduce and what's next" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: RequestTablesChunk,
};

export default chunkThree;
