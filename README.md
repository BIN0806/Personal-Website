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
| LLM Kernel Inference | 2026-10-23 |
| SAAS / Resemble AI | 2026-10-21 |
| LLM Inference | 2026-10-07 |
| PCAP | 2026-10-04 |
| Monkey Type Fork | 2026-09-27 |
| Nolan / AMC Event Study | 2026-09-16 |

The collection is in `projects/projects.tsx`. LLM Kernel Inference has its own
`notebooks/llm-kernel-inference.tsx` and one separate article per completed chunk:

| Chunk | Article URL under `/blog/projects/llm-kernel-inference/` | Source commit in `BIN0806/GPU-Inference` |
| --- | --- | --- |
| 1: A page pool before a GPU | `chunk-1-page-pool` | `f1b120ee807de78aaf07987754e75fcc1a8ec3eb` |
| 2: Sharing pages without sharing writes | `chunk-2-shared-pages` | `675a8c729712ff1bdb73cb02e2f5dfde57cf6a61` |
| 3: Request tables that fail atomically | `chunk-3-request-transactions` | `5befbdfe44bcda7db883d6135927e98ac7ced3c2` |

The posts adapt the corresponding commit's code, authored article, and validation
record. Each exposes its commit link near the opening and a source section with
files pinned to the full SHA. `notebooks/kernel-inference/sources.tsx` holds those
revisions and dates. The first three commits reconstruct validated development
snapshots; the linked history notes explain that provenance. Their date is
2026-10-23 in America/Los_Angeles, and the updates array lists 3, 2, 1 to preserve
that progression when calendar dates tie. The posts retain CPU-only scope,
actual findings versus injected failures, and the unresolved ASan status.

For each future completed chunk, read its commit and pinned evidence, add a new
content component and source record, then add a separate entry to this notebook's
updates array. Keep existing slugs and historical scope stable. Do not create
posts for planned chunks or infer measured speedups from test durations.

The other project content is in `notebooks/project-history.tsx`. Each notebook includes a short overview,
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
