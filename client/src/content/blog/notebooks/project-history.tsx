import type { BlogSetup } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";
import { ArticleNote, ArticleSection } from "@/components/blog/article-blocks";

interface ProjectHistory {
  slug: string;
  title: string;
  description: string;
  /** Last project work in Codex, in America/Los_Angeles; not a file timestamp. */
  lastWorked: string;
  updateTitle: string;
  overview: string;
  work: string[];
  challenges: {
    title: string;
    problem: string;
    resolution: string;
    lesson: string;
  }[];
  latestWork: string;
  next: string;
  tags: string[];
}

// These are retrospective work logs, so their entry dates are the dates of the
// work being documented. Opening a chat or rebuilding the site doesn't change them.
// Add future BlogUpdate entries to each notebook's `updates` array. Give a new
// entry its actual work date, or set `edited` when revising an existing entry.
function historyNotebook(history: ProjectHistory): BlogSetup {
  function WorkLog() {
    return <>
      <p className="article-lead">{history.description}</p>
      <ArticleNote>Work log through <time dateTime={history.lastWorked}>{formatBlogDate(history.lastWorked)}</time>. A retrospective summary of the latest work on this project.</ArticleNote>
      <ArticleSection id="overview" title="The idea">
        <p>{history.overview}</p>
      </ArticleSection>
      <ArticleSection id="work" title="The work so far">
        <ul>{history.work.map((item) => <li key={item}>{item}</li>)}</ul>
      </ArticleSection>
      <ArticleSection id="challenges" title="Unexpected problems and how I handled them">
        {history.challenges.map((challenge) => <div key={challenge.title}>
          <h3>{challenge.title}</h3>
          <p>{challenge.problem}</p>
          <p>{challenge.resolution}</p>
          <p>{challenge.lesson}</p>
        </div>)}
      </ArticleSection>
      <ArticleSection id="latest" title="Where I left off">
        <p>{history.latestWork}</p>
      </ArticleSection>
      <ArticleSection id="next" title="What to explore next">
        {/* Replace this prompt with the next dated implementation or experiment. */}
        <p>{history.next}</p>
      </ArticleSection>
    </>;
  }

  const words = [
    history.description, history.overview, ...history.work,
    ...history.challenges.flatMap((challenge) => [challenge.title, challenge.problem, challenge.resolution, challenge.lesson]),
    history.latestWork, history.next,
  ].join(" ").trim().split(/\s+/).length;

  return {
    slug: history.slug,
    title: history.title,
    description: history.description,
    categories: ["Work log"],
    updates: [{
      slug: "work-log",
      title: history.updateTitle,
      summary: history.latestWork,
      date: history.lastWorked,
      category: "Work log",
      readingMinutes: Math.max(1, Math.ceil(words / 220)),
      tags: history.tags,
      sections: [
        { id: "overview", title: "The idea" },
        { id: "work", title: "The work so far" },
        { id: "challenges", title: "Problems and solutions" },
        { id: "latest", title: "Where I left off" },
        { id: "next", title: "What to explore next" },
      ],
      Content: WorkLog,
    }],
  };
}

export const resembleResearch = historyNotebook({
  slug: "saas-resemble-research",
  title: "SAAS / Resemble AI",
  description: "Research on synthetic media detection, model representations, and what predictive error can tell us.",
  lastWorked: "2026-10-21",
  updateTitle: "Exploring world-model prediction error",
  overview: "This SAAS research project examines how to evaluate detection systems and understand the representations inside models. The work moves from audio evaluation and activation caching to interpretability experiments and video world models.",
  work: [
    "Worked on released-score equal-error-rate reproduction and activation-caching workflows.",
    "Explored induction heads, probes, sparse features, and model interventions.",
    "Built a walkthrough of predictive error, context ablation, uncertainty, and the limits of causal interpretation.",
  ],
  // Evidence: research README, Week 1 challenges, Week 3 METHODS and NUISANCE.
  challenges: [
    {
      title: "Saving activations became a storage and correctness problem",
      problem: "Capturing every intermediate tensor produces much more data than a model's final output. There was also a subtler issue: a cached tensor view could change when a later operation modified the same memory in place.",
      resolution: "I copied detached tensors to CPU when a full snapshot was needed, measured their actual storage, and added disk budgets and a free-space reserve. For the video probes, I retained pooled vectors instead of caching every token from every layer.",
      lesson: "This made the analysis fit a bounded local workflow. Passive hooks preserved the backend fixture's logits; measuring the full trained audio model still depends on obtaining the missing inference assets.",
    },
    {
      title: "A strong detection score could have an easier explanation",
      problem: "Real and generated clips differed in source resolution, duration, and other dataset properties. A high classification score could reflect those differences rather than an understanding of physical plausibility.",
      resolution: "I added a metadata-only baseline, source-group checks, unseen-generator evaluation, and repeated shuffled-label controls. The baseline exposed a strong alternative explanation for the selected authenticity dataset.",
      lesson: "The useful result was identifying the confound and narrowing the claim. Better controls can reveal why a promising result is inconclusive; they do not automatically remove the dataset bias.",
    },
    {
      title: "Interventions needed a consistent measurement",
      problem: "Internal block activations and the model's normalized final output use different coordinates. Applying a probe fitted on one directly to the other would make an intervention difficult to interpret.",
      resolution: "I used a separately fitted final-output readout and held it fixed while changing an internal block. Identity controls and shape/device checks helped distinguish an experimental effect from a wiring mistake.",
      lesson: "A representation containing useful information is only the first step. Testing whether a computation matters requires a consistent readout and explicit intervention controls.",
    },
  ],
  latestWork: "Created and executed a predictive-error walkthrough using saved experiment results. Context ablation increased prediction error; reliable physics correlation and synthetic-video detection remained unestablished.",
  next: "Document future experiments with their controls, held-out evaluation, uncertainty, and remaining questions before drawing broader conclusions.",
  tags: ["Research", "Interpretability", "World models"],
});

export const llmInference = historyNotebook({
  slug: "llm-inference",
  title: "LLM Inference",
  description: "Serving language models on GPUs, observing their behavior, and scaling complete model replicas.",
  lastWorked: "2026-10-07",
  updateTitle: "Serving, observing, and scaling vLLM",
  overview: "The project wraps vLLM with deployment, monitoring, and scaling infrastructure. It serves existing Qwen models through an OpenAI-compatible streaming API and investigates how model parallelism differs from adding independent serving replicas.",
  work: [
    "Validated GPU inference and streaming responses, including concurrent requests and completion markers.",
    "Explored tensor parallelism and same-host Ray execution.",
    "Deployed single-node k3s serving with Prometheus and KEDA, including constrained scale-from-zero experiments.",
  ],
  // Evidence: Inference/docs/project-status.md, "Important failures and fixes".
  challenges: [
    {
      title: "The model fit was not the whole GPU memory budget",
      problem: "The initial 9B startup ran out of memory on the 12 GiB GPUs. The template reserved a 32k context and eight sequences, so fitting the model weights alone was not enough.",
      resolution: "I used the approved text-only contract with an 8k context and two sequences, and kept the model and tensor-parallel topology explicit. The fix reduced the KV-cache requirement instead of silently swapping in a smaller model.",
      lesson: "I had to budget weights, KV cache, runtime workspace, and headroom together. A successful launch under that contract does not imply the same hardware can support arbitrary context lengths or concurrency.",
    },
    {
      title: "Kubernetes injected a setting that crashed vLLM",
      problem: "The Kubernetes pod crash-looped because service-link environment injection set VLLM_PORT to a tcp:// address. vLLM expected a port value, so a platform-generated setting collided with the application's own configuration.",
      resolution: "I set enableServiceLinks to false on the pod specification, then verified health, model identity, and streaming responses after the pod started.",
      lesson: "Container configuration includes values supplied by the platform as well as the values written in a manifest. Checking the actual runtime environment was more useful than changing the model-serving code.",
    },
    {
      title: "Scaling to zero removed the signal needed to wake up",
      problem: "A queue-depth scaler worked while a replica was running. At zero replicas, vLLM's metrics disappeared, leaving that scaler without a request signal.",
      resolution: "I added a durable HTTP interceptor that stayed available, observed incoming requests, requested activation, and held the original request while a model replica became ready.",
      lesson: "A single non-retried request completed through the lab's cold start after roughly 152 seconds. That validated the activation path while making the startup delay visible; a fast cold start and production high availability remain separate concerns.",
    },
  ],
  latestWork: "Reviewed the request flow, streaming checks, GPU replica scaling, and how PagedAttention manages KV-cache allocation. The lab rentals were torn down after testing.",
  next: "Keep future benchmarks tied to a declared model, workload, and hardware configuration so results remain comparable.",
  tags: ["vLLM", "Kubernetes", "GPU inference"],
});

export const pcap = historyNotebook({
  slug: "pcap",
  title: "PCAP",
  description: "Turning captured market-data packets into reconstructable order books, audited datasets, and replay.",
  lastWorked: "2026-10-04",
  updateTitle: "From captured packets to audited replay",
  overview: "The Data Normalization Pipeline processes offline PCAP captures containing market-data messages. It reconstructs order-book state, records uncertainty when data is missing, persists the results, and exposes them through history and replay tools.",
  work: [
    "Tightened packet validation, sequence recovery, and order-book consistency.",
    "Added immutable audited datasets and bounded processing with reliable publication.",
    "Connected persisted history and replay to the API and dashboard controls.",
    "Recorded architectural decisions, verification results, and an ordered documentation guide.",
  ],
  // Evidence: Data-Normalization-Pipeline/docs/DECISION-EVOLUTION.md.
  challenges: [
    {
      title: "A plausible order book could still be wrong",
      problem: "A capture can begin after resting orders were created or contain a sequence gap. Treating the first available suffix as complete state produced precise-looking depth without enough evidence. A recovery timeout also cleared buffered successors that were needed to resume.",
      resolution: "I made fresh engines start untrusted, required an accepted opening boundary or authoritative snapshot, and kept failed recovery gated. Timeout handling now preserves received successors, while missing sequences and discarded received records remain distinct in the audit trail.",
      lesson: "Regression tests reproduced the false-trust and message-loss cases. Recovery can restore current state, but it cannot recreate missing historical events; unknown depth stays explicitly unknown.",
    },
    {
      title: "Rejecting an update could corrupt an otherwise valid book",
      problem: "An invalid replacement removed the old order before validating the new one. Duplicate references could also increase aggregate quantity before overwriting the order map, leaving phantom liquidity.",
      resolution: "I moved reference, price, quantity, and arithmetic checks ahead of mutation. Snapshot rebuilds use temporary state and publish only on success, and invariants recompute every price level from the complete order map.",
      lesson: "Failure atomicity became part of the contract: a rejected operation must preserve the previous valid state. Checking only the best few levels was insufficient because deeper corruption could remain invisible.",
    },
    {
      title: "The browser could lose precision and fall behind replay",
      problem: "Epoch timestamps in nanoseconds did not fit safely in JavaScript numbers. A disconnected or lagging client could also miss an invalidation and continue displaying stale state.",
      resolution: "I kept exact timestamps as strings across the API and used BigInt helpers in the client. Generation and sequence cursors plus authoritative snapshots let the current view recover after reconnects or lag.",
      lesson: "Replay correctness had to extend through the API into the browser. The UI may omit intermediate tape rows, while the persisted archive retains the received record.",
    },
  ],
  latestWork: "Finished the offline implementation and verification, then organized a reading path through the updated architecture, protocol, operations, and benchmark documentation.",
  next: "Live exchange connectivity and real-feed production qualification remain future work; document them as separate milestones.",
  tags: ["Rust", "Market data", "Data pipelines"],
});

export const monkeyType = historyNotebook({
  slug: "monkey-type-fork",
  title: "Monkey Type Fork",
  description: "A Monkeytype fork for understanding typing patterns through local timing and error diagnostics.",
  lastWorked: "2026-09-27",
  updateTitle: "Typing diagnostics and a local launcher",
  overview: "The fork builds on Monkeytype's typing tests with an optional local diagnostics panel. It examines character patterns, timing, and corrections to suggest focused practice. The analysis is a statistical baseline rather than a trained machine-learning model.",
  work: [
    "Added opt-in, browser-local diagnostics and comparisons between compatible sessions.",
    "Analyzed recurring weak characters, bigrams, trigrams, hesitation, and correction patterns.",
    "Added visual feedback and practice drawn from observed typing patterns.",
    "Added terminal start, stop, restart, status, and log commands with background process tracking.",
  ],
  // Evidence: Monkeytype docs/FORKED.md and the local development work log.
  challenges: [
    {
      title: "One pause could look like a persistent typing weakness",
      problem: "Typing timings are noisy. A long pause, an automatic edit, or just one unusual character pair could dominate a naive average and produce an overconfident diagnosis.",
      resolution: "I used medians, filtered unusable intervals and automatic/composition input, and shrank small-sample error estimates toward the overall baseline. Confidence labels reflect the available observations, and history comparisons stay within the same language and keyboard layout.",
      lesson: "The result is an interpretable statistical baseline. It can show where hesitation repeats, but timing alone cannot establish whether the cause is recognition, finger movement, distraction, or something else.",
    },
    {
      title: "A working development server looked like a failed build",
      problem: "Starting the fork produced large Babel output, a Font Awesome Sass deprecation, and stale browser-data warnings. Alongside unavailable account-backend messages, that output made it difficult to tell whether the local diagnostics feature was actually broken.",
      resolution: "I checked that the server was listening and verified the diagnostics through its tests, type-aware checks, production build, and browser smoke tests. The diagnostics use local browser storage, so they can run without a Monkeytype account or a configured backend.",
      lesson: "Separating feature failures from upstream warnings gave me a repeatable verification path. The launcher also uses the repository's pinned runtime and resolves its path so it works from other terminal directories.",
    },
  ],
  latestWork: "Brought the Monkeytype launcher into the shared command workflow and verified its start, status, and stop behavior on a separate local port.",
  next: "Use future updates to document diagnostics validation, local-data controls, and changes to the practice experience.",
  tags: ["TypeScript", "Typing analytics", "Open source fork"],
});

export const nolanAmc = historyNotebook({
  slug: "nolan-amc-event-study",
  title: "Nolan / AMC Event Study",
  description: "A reproducible notebook examining AMC returns around Christopher Nolan film releases.",
  lastWorked: "2026-09-16",
  updateTitle: "Testing the event story against confounders",
  overview: "The study asks whether film-release events are associated with unusual AMC stock returns. It combines an event-study workflow with model diagnostics, placebo checks, and attention to other events that could explain the same price movements.",
  work: [
    "Built and executed a research notebook with figures, statistical tests, and a reproducible methodology.",
    "Examined volatility, leverage, placebo timing, and sensitivity to individual events.",
    "Added research on media attention, Barbenheimer, competing films, earnings, and financing news.",
  ],
  // Evidence: event-study implementation log, assessment and validation report.
  challenges: [
    {
      title: "Two reasonable tests told different stories",
      problem: "The four-event average looked large, and the placebo timing test looked promising. But the film-level interval was wide and the main test did not reject zero. Removing Oppenheimer also weakened the placebo result.",
      resolution: "I reported both tests with their different reference distributions, retained the planned event windows, and added leave-one-event-out checks. The attention extension tested overlapping publicity and financing explanations with a joint multiple-testing correction.",
      lesson: "The apparent story was not stable enough to support a director-specific causal conclusion. The result became a study of uncertainty and confounding rather than a claim that a large point estimate proved an effect.",
    },
    {
      title: "Adjusted stock prices did not resolve every corporate action",
      problem: "AMC's APE distribution was not fully reconstructed as shareholder wealth by the vendor's adjusted series. Treating 'adjusted' as a complete total-return guarantee would have hidden a material limitation.",
      resolution: "I flagged affected estimates and added post-APE estimation alternatives rather than inventing missing prices. The notebook keeps those sensitivities and the overlapping company events visible.",
      lesson: "This bounds what the return series can answer; it does not repair the missing wealth history. Data definitions matter as much as the regression code.",
    },
    {
      title: "The notebook failed the clean-environment check",
      problem: "A fresh install exposed an incompatibility between the selected notebook exporter and the newer Markdown parser, plus a plotting-parser version mismatch.",
      resolution: "I pinned the compatible dependencies, saved the resolved requirements, and reran every code cell in a fresh kernel. Independent scientific tests and an artifact validator checked the saved results and figures.",
      lesson: "A notebook that runs in the original environment is not yet reproducible. The clean-environment run turned dependency assumptions into an explicit part of the project.",
    },
  ],
  latestWork: "Added confounder research and exploratory attention tests. The attention relationships did not survive multiple-testing correction, and the study did not establish a reliable Nolan-specific causal effect.",
  next: "Explore a broader film-and-exhibitor panel and document how results change across event windows and alternative controls.",
  tags: ["Python", "Jupyter", "Quantitative research"],
});
