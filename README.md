# My Website

You can view my website here:

[Billy's Personal Website](https://billynguyen.netlify.app)

Feel free to explore and let me know if you have any feedback!

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5000` (or set `PORT=3000` if 5000 is taken on macOS).

## Obsidian graph

Generate the Self-Learning graph JSON from a vault folder:

```bash
node scripts/generate-obsidian-graph.mjs \
  --vault /path/to/ObsidianVerse/MultiVerse \
  --out client/public/obsidian-graph.json
```

## Blog / project journal

The blog has two collections. **Productivity** contains two setup notebooks:

- **NVIM setup**: Workflow plugins, Keybindings, Configuration.
- **Obsidian setup**: Vault structure, Templates, Plugins & workflow.

**Projects** contains engineering and research notebooks with retrospective work
logs. Their initial dates are the latest actual project work in Codex, converted
to America/Los_Angeles, rather than chat sidebar recency or file modification time:

| Notebook | Last worked |
| --- | --- |
| LLM Kernel Inference | 2026-10-25 |
| SAAS / Resemble AI | 2026-10-21 |
| LLM Inference | 2026-10-07 |
| PCAP | 2026-10-04 |
| Monkey Type Fork | 2026-09-27 |
| Nolan / AMC Event Study | 2026-10-27 |

The collection is in `projects/projects.tsx`. LLM Kernel Inference has its own
`notebooks/llm-kernel-inference.tsx` and one separate article per completed chunk:

| Chunk | Article URL under `/blog/projects/llm-kernel-inference/` | Implementation commit | Evidence follow-up |
| --- | --- | --- | --- |
| 1: A page pool before a GPU | `chunk-1-page-pool` | [3d4f690](https://github.com/BIN0806/GPU-Inference/commit/3d4f690061a7e36c992313bd6b14bd35218c24bc) | — |
| 2: Sharing pages without sharing writes | `chunk-2-shared-pages` | [b3ffc58](https://github.com/BIN0806/GPU-Inference/commit/b3ffc58d08619de16d12114dc4fd612891522b1d) | — |
| 3: Request tables that fail atomically | `chunk-3-request-transactions` | [8b3bd75](https://github.com/BIN0806/GPU-Inference/commit/8b3bd7531f744784a02399be0a91c8ff9edf185b) | — |
| 4: Measuring page use and CPU workloads | `chunk-4-cpu-workloads` | [94ee297](https://github.com/BIN0806/GPU-Inference/commit/94ee2973597c015629bf8618c49c941862d4d2ef) | — |
| 5: Proving the sanitizer can see | `chunk-5-sanitizer-validation` | [a5041ec](https://github.com/BIN0806/GPU-Inference/commit/a5041ece6e01c559161c354474239bad22ab4928) | [7e82018](https://github.com/BIN0806/GPU-Inference/commit/7e820180a242b39a2a2082f6a28a395d207fef7d) |
| 6: Growing request tables with suffix rollback | `chunk-6-request-storage-reuse` | [d0ad3a8](https://github.com/BIN0806/GPU-Inference/commit/d0ad3a8b459fa52ce1cfa16964a7b783b485eafb) | [05611b7](https://github.com/BIN0806/GPU-Inference/commit/05611b773b065973115096b9d8d50542fb043b8d) |
| 7: Defining residual RMSNorm before fusion | `chunk-7-rmsnorm-contract` | [e76e02b](https://github.com/BIN0806/GPU-Inference/commit/e76e02b602eacfca184e1a9dff0fb7c9a25d8061) | [b2a970f](https://github.com/BIN0806/GPU-Inference/commit/b2a970f681da619b69b512c7e4dd1b7e0e05998d) |

The posts follow public commit changes, design decisions, experiment reports,
and recorded validation. Each exposes its implementation link near the opening
and a source section with files pinned to full SHAs. Completed evidence gets its
own follow-up commit link, so a result pending at implementation time is not
presented as already executed. `notebooks/kernel-inference/sources.tsx` holds
these revisions and dates. The first three commit IDs were updated after source
history cleanup; they link public engineering records instead of ignored local
blog drafts and raw artifacts. Their code/test/build inputs are unchanged.

Dates use America/Los_Angeles: chunks 1–3 are October 23, chunk 4 is October 24,
and chunks 5–7 are October 25. The updates array lists 7 through 1 to break
same-date ties in chunk order. CPU performance, CPU correctness, prepared GPU
probes, and actual device execution remain distinct. Linux ASan passes are
documented from chunk 5 onward; the local Mac startup problem stays unresolved.

For each future completed chunk, read its commit and pinned evidence, add a new
content component and source record, then add a separate entry to this notebook's
updates array. Group validation-only follow-ups with their chunk. Include actual
problems, remedies, measured tradeoffs, and remaining limits. Keep existing slugs
and historical scope stable. Do not create posts for planned chunks or infer
measured speedups from test durations.

Nolan / AMC now has its own `notebooks/nolan-amc.tsx` with four substantial
research stages, rather than a post for every commit:

| Stage | Article slug | Work date (America/Los_Angeles) | Commit group |
| --- | --- | --- | --- |
| Protocol and frozen inputs | `part-1-protocol-and-data` | 2026-09-16 | `e755b02` → `addcf2a` |
| Executed event study | `part-2-event-study` | 2026-09-16 | `a58d5f1` → `a4451c7` |
| Attention and confounders | `part-3-attention-and-confounders` | 2026-09-16 | `39e20e1` → `80bacbf` |
| Research audit and proposed options extension | `part-4-options-research-audit` | 2026-10-27 | `b1e78a7` |

The notebook remains at `/blog/projects/nolan-amc-event-study`; its former
`work-log` URL redirects there. Same-day entries keep reverse stage order.
The October 28 relocation/reference-bundling commit is not a research stage and
does not update the notebook date. Only substantial work gets a new post;
related fixes and evidence follow-ups belong with their stage.

This research checkout has no configured public remote. Source citations use
local commit IDs and downloadable JSON records under `client/public/blog/nolan-amc/sources/`.
These contain selected committed research documents/results and full SHA-256
identities; hash-only code references are labeled. No repository URL is invented.
The two research figures are copied unchanged from their executed revisions.
Regenerate the records, provenance module, and figures with:

```bash
python3 scripts/export-nolan-blog-sources.py --repository /path/to/amc_nolan
```

The exporter reads Git objects and never changes the research repository. It
does not copy raw market payloads, notebooks, personal interview material, or
unrelated reference projects. Article text distinguishes historical execution,
current audit findings, and proposed options work. Options strategy performance
is unavailable; the equity CAR is not a strategy return or causal estimate.

The remaining project content is in `notebooks/project-history.tsx`. Each notebook includes a short overview,
implemented work, documented problems and solutions, the last activity, and a
prompt for a future update. Problem narratives are grounded in the repositories'
decision logs, validation reports, and Codex work history; unresolved limits are
kept explicit. Reading times account for the full article text.
The work-log date describes when the recorded work happened, not when this
retrospective was added to the website. Chat transcripts stay out of the site.

Both the homepage **Blog** tab and the full blog use the same hierarchy:
collection → notebook → progression categories and dated updates → article.
**Back** moves up a level. Project, setup, and update dates appear on the left,
newest modification first. The compact homepage lists and full setup chooser
show five rows before scrolling, with hidden scrollbars and keyboard/touch access.

The blog uses the same SiteNavigation and Footer components as the homepage.
Its reading layout inherits the site's base colors and fonts; only the
article grid, contents navigation, and reading spacing are specific to the blog.

### Add a project or setup

1. Copy `client/src/content/blog/templates/project.template.tsx` into `projects/`.
   Each file in that directory exports one `BlogProject` and becomes one row.
2. For a project with setup tabs, copy `templates/setup.template.tsx` into
   `setups/`, import it in the project file, and add it to the project's `setups`
   array. See `projects/productivity.tsx` for the two existing setup imports.
   Set `childType: "project"` on the collection to label those tabs as projects;
   Productivity keeps the default setup labels.
3. A simple project can keep its entries directly in `updates`. A project whose
   entries all live in setups uses `updates: []`.

The current setup content lives in `setups/nvim-setup.tsx` and
`setups/obsidian-setup.tsx`. These contain commented starter articles ready to
replace. The original generic journal demo is preserved in `examples/` and is
not listed as a project. Neither `templates/` nor `examples/` is auto-published.

Each setup's optional `repositoryUrl` adds a **Settings on GitHub** link to its
setup page and every post within it. NVIM uses `BIN0806/nvim_settings`, and
Obsidian uses `BIN0806/obsidian_settings`. Set or change the URL once in the
setup metadata; future posts inherit the link automatically.

### Add a progression update

Add an entry to the relevant setup's `updates` array. Set its slug, title,
summary, publication `date` (YYYY-MM-DD), category, reading time, tags, sections,
and content component. The setup's `categories` array defines its filter labels;
any additional category used by an update also appears automatically.
Categories without entries show an empty state until you add their first update.

Entries sort by `edited`, falling back to `date`. When revising an entry, set
`edited` to its modification date. Setup dates use their most recently modified
entry; project dates include entries across all their setups. Article headers
retain the original publication date and show the edit date separately. Dates
are consistent across timezones. Keep slugs stable after sharing links.

The `sections` array builds the article contents list. Match its IDs to the
`ArticleSection` IDs in the JSX. `CodeBlock` and `ArticleNote` provide consistent
styling. Images go in `client/public/blog/<project-slug>/` and can be referenced
as `/blog/<project-slug>/image.png`. Wrap wide tables in `article-table-scroll`.

### URLs and preview

- Project: `/blog/productivity`
- Setup: `/blog/productivity/nvim-setup`
- Article: `/blog/productivity/nvim-setup/workflow-plugins`
- Projects collection: `/blog/projects`
- Project notebook: `/blog/projects/pcap`
- Project work log: `/blog/projects/pcap/work-log`

Old NVIM and Obsidian URLs redirect to their new setup locations. For the
frontend preview, run `npm run dev:client`; use `npm run dev` when you also need
the homepage GitHub activity API. Run `npm run check` and `npm run build` before
publishing. New content goes live after the normal Netlify deployment; the
Netlify fallback supports directly opening nested blog URLs.
