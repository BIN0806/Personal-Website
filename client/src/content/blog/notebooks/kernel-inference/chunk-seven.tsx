import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { ChunkSources, CommitSource, kernelFileUrl, kernelSources } from "./sources";

function RmsNormContractChunk() {
  return <>
    <p className="article-lead">Before fusing residual addition and RMSNorm, I needed to define which residual the normalization consumes. Returning the right rounded output can still hide a calculation that normalized a different value.</p>
    <CommitSource source={kernelSources.seven} />
    <ArticleNote>Chunk 7 implements an independent scalar oracle, an eager PyTorch reference, and GPU preflight preparation. CPU checks ran locally and on Linux. CUDA kernels, device execution, Compute Sanitizer, and GPU performance remain untested.</ArticleNote>

    <ArticleSection id="contract" title="Freeze a bounded two-output contract">
      <p>The operation returns fresh outputs <code>(z, y)</code>: a rounded residual and its weighted RMS normalization. Inputs are contiguous <code>[M, D]</code> tensors with a <code>[D]</code> weight, all on one device with FP16 or FP32 storage. Empty batches are valid, widths range from 1 to 8,192, and inference inputs do not request gradients.</p>
      <p>The first development domain requires finite activations with magnitude at most 1,024 and weights at most 16. Nonempty input ranges must not overlap, though disjoint contiguous slices of one storage are allowed. Epsilon is fixed to FP32 <code>1e-6</code>. Unsupported inputs fail instead of being clamped.</p>
      <CodeBlock filename="Rounded-residual contract; T is the storage dtype">{`z_j = round_T(FP32(x_j) + FP32(residual_j))
v   = mean_j(FP32(z_j) * FP32(z_j))
y_j = round_T((FP32(z_j) * rsqrt(v + FP32(1e-6)))
              * FP32(weight_j))`}</CodeBlock>
      <p>Normalization consumes the stored rounded <code>z</code>. FP32 accumulation and the explicit rounding point matter. This bounded contract does not establish support for BF16, arbitrary strides, in-place updates, mixed weight precision, or every possible model activation.</p>
    </ArticleSection>

    <ArticleSection id="rounding" title="The test weakness: a wrong path passed broad tolerance">
      <p>A deliberately incorrect calculation returned the rounded residual but normalized the unrounded sum. Ordinary FP16 output tolerances accepted it. The finding was a gap in what the tests distinguished, not a CUDA bug discovered on hardware.</p>
      <CodeBlock filename="Targeted FP16 CPU witness">{`x        = [1, 2, 3]
residual = [2^-11, 2^-10, 2^-9]
weight   = [1, 1, 1]

rounded z = [1, 2, 3.001953125]
correct first y = 0.462646484375
wrong first y   = 0.462890625`}</CodeBlock>
      <p>I added an exact assertion for this targeted CPU witness alongside the broad numerical matrix. The small difference lies within the general FP16 tolerance, so random inputs and loose thresholds alone cannot define semantic equivalence. This exact case does not promise bitwise normalized outputs for every future GPU reduction order.</p>
    </ArticleSection>

    <ArticleSection id="oracle" title="Use an oracle that does not call the same tensor code">
      <p>The standard-library oracle uses explicit FP16/FP32 quantization, then FP64 <code>math.fsum</code>, square root, and scaling before the final storage cast. Expected outputs therefore do not come from the same PyTorch expression being checked.</p>
      <p>The eager reference uses FP32 tensor math and separates its checked wrapper from prevalidated computation. Shape, aliasing, finite-value, and range scans belong at the correctness boundary; on a GPU they can synchronize. A future benchmark must validate outside its timed region before calling the mathematical path under inference mode.</p>
      <p>Residuals require bitwise equality. Normalized outputs use per-element absolute-plus-relative thresholds: FP16 <code>(2e-3, 2e-3)</code>, FP32 <code>(1e-5, 1e-4)</code>. Nonfinite comparisons fail. The checker also records maximum absolute error, normalized RMS error, and the worst coordinate. Thresholds were not widened to make the matrix pass.</p>
    </ArticleSection>

    <ArticleSection id="setup" title="Setup findings and cross-host differences">
      <p>A local Python 3.14 certificate error interrupted dependency metadata retrieval. A certificate-verifying curl request and a Python 3.12 virtual environment resolved setup without disabling TLS. Hash-pinned CPU wheel environments keep Torch optional for the C++ build.</p>
      <p>The small reference environment lacks the optional NumPy bridge, so PyTorch emits a warning. No test uses NumPy conversion, <code>pip check</code> passes, and the warning remains in the evidence.</p>
      <p>The 218-case matrix covers empty and nonempty batches, odd and boundary widths, both dtypes, cancellation, tiny values, bounded large values, and rounding patterns. All cases passed locally and on Linux, with exact residual bits. Maximum absolute output errors were FP16 <code>0.001953125</code> and FP32 <code>9.5367431640625e-7</code>.</p>
      <p>The largest per-case FP32 normalized RMS error differed slightly: approximately <code>8.27e-8</code> on macOS and <code>9.45e-8</code> on Linux. Both satisfy the unchanged threshold. I retained the backend difference rather than describing the numerical results as identical.</p>
    </ArticleSection>

    <ArticleSection id="preflight" title="Give inventory and execution separate evidence">
      <p>The local inventory correctly reported absent CUDA and profiler tools and unavailable CUDA in the CPU PyTorch environment. Collecting that inventory can succeed while execution readiness remains false. Package names and version commands cannot substitute for compiling and running a device probe.</p>
      <p>The prepared preflight path, for an already provisioned GPU host, checks native CUDA, PyTorch CUDA, Triton, compiled CUDA expressions, and memcheck independently. Counter permission and timeline capture are separate outcomes. Missing tools, failed compilation, timeouts, denied counters, and false success markers have explicit classifications.</p>
      <p>A global deadline bounds child commands and terminates timed-out process groups. The final deadline regression reran the two affected Python CTest entries. These fixture tests establish orchestration behavior, not successful device execution.</p>
      <ArticleNote>The CUDA smoke source and profiler paths have not run on hardware in this chunk. The preflight script does not provision a GPU, change host permissions, or establish that the future RMSNorm kernels are correct.</ArticleNote>
    </ArticleSection>

    <ArticleSection id="validation" title="Executed CPU results and reproduction">
      <div className="article-table-scroll"><table>
        <caption>The implementation and its <a href={kernelFileUrl(kernelSources.seven, "docs/VALIDATION.md", kernelSources.seven.followUp)}>completed Linux evidence</a> describe distinct executed checks.</caption>
        <thead><tr><th>Environment / check</th><th>Recorded outcome</th></tr></thead>
        <tbody>
          <tr><td>Local Debug / Release</td><td>75/75 each.</td></tr>
          <tr><td>Local UBSan</td><td>76/76; local ASan remains unresolved.</td></tr>
          <tr><td>Linux Debug / Release</td><td>75/75 each.</td></tr>
          <tr><td>Linux ASan / UBSan / combined</td><td>76/76 each, with detector probes and flag audits.</td></tr>
          <tr><td>PyTorch CPU reference, both hosts</td><td>10 unit tests and 218 matrix cases pass.</td></tr>
        </tbody>
      </table></div>
      <p><a href="https://github.com/BIN0806/GPU-Inference/actions/runs/40270856228">Linux run 40270856228</a> completed all six jobs against <code>e76e02b</code>. The follow-up changes documentation and evidence only. Linux per-case JSON was not uploaded; printed aggregate metrics and retained logs support its public summary. The committed local result contains the individual CPU cases.</p>
      <CodeBlock filename="Dependency-free oracle; full matrix needs the pinned CPU environment">{`PYTHONPATH=python python3 -m unittest discover \\
  -s tests/python -p test_rmsnorm_oracle.py

# After installing the appropriate hash-pinned CPU requirements:
PYTHONPATH=python .venv/bin/python -m unittest discover \\
  -s tests/python -p 'test_rmsnorm_*.py' -v
.venv/bin/python scripts/check_rmsnorm_reference.py \\
  --output artifacts/chunk7-rmsnorm-cpu`}</CodeBlock>
      <p>The next implementation step is separate CUDA addition and RMSNorm controls before fusion, preserving the same two-output work. Device correctness, sanitizer execution, and equivalent eager/compiled/Triton comparisons still need real evidence. No normalization speedup is claimed, and infrastructure spending remains $0.</p>
    </ArticleSection>
    <ChunkSources source={kernelSources.seven} />
  </>;
}

const chunkSeven: BlogUpdate = {
  slug: "chunk-7-rmsnorm-contract",
  title: "Part 7: Defining residual RMSNorm before fusion",
  summary: "Freeze residual rounding with an independent oracle and a 218-case CPU matrix. A targeted FP16 witness catches behavior broad tolerances miss; Linux evidence and GPU preflight preparation retain their separate limits.",
  date: kernelSources.seven.date,
  category: "Numerical contracts",
  readingMinutes: 7,
  tags: ["RMSNorm", "Floating point", "GPU preflight"],
  sections: [
    { id: "contract", title: "The two-output contract" },
    { id: "rounding", title: "The rounding test weakness" },
    { id: "oracle", title: "An independent oracle" },
    { id: "setup", title: "Setup and numerical findings" },
    { id: "preflight", title: "Inventory and execution" },
    { id: "validation", title: "CPU checks and reproduction" },
    { id: "sources", title: "Commit and supporting records" },
  ],
  Content: RmsNormContractChunk,
};

export default chunkSeven;
