import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { nolanSources, ResearchRevision, ResearchSources } from "./sources";

function Protocol() {
  return <>
    <p className="article-lead">A recognizable film release makes an appealing market story. I started by defining which releases, dates, returns, and tests would count before inspecting their estimated effects.</p>
    <ResearchRevision source={nolanSources.protocol} />
    <ArticleNote>This stage freezes the research protocol and source snapshots. It is an internally dated retrospective plan, not a prospective public preregistration. The data end in 2025; their retrieval in September 2026 does not make them a point-in-time trading database.</ArticleNote>
    <ArticleSection id="population" title="The eligible population is only four films">
      <p>AMC's current listing began on December 18, 2013. Restricting the study to first U.S. wide releases through December 31, 2025 leaves Interstellar, Dunkirk, Tenet, and Oppenheimer. Earlier Nolan films go into an exclusion ledger rather than receiving observations from a listing that did not yet exist.</p>
      <p>I recorded wide, limited, preview, international, and mapped exchange dates separately. Day zero is the first NYSE session on or after the U.S. wide release. Opening-weekend response uses the first session after Sunday, including holiday effects. Re-releases are catalogued, not treated as independent first releases.</p>
      <p>This prevents a hidden change in population or date convention from becoming an extra modeling choice after the results are visible. It also exposes the central limitation immediately: four films from one issuer cannot supply a large independent event sample.</p>
    </ArticleSection>
    <ArticleSection id="data" title="Freeze inputs and make missing data fail">
      <p>The ingestion stage saves Yahoo chart responses for AMC, SPY, IWM, and Cinemark, alongside exact source URLs, retrieval times, adjustment assumptions, and SHA-256 hashes. Each series has 3,027 sessions over the fixed study period. Film dates, exclusions, re-releases, and potential confounders have separate sourced tables.</p>
      <p>Raw and processed data remain separate. Missing observations are not forward-filled, and duplicate or incomplete exchange-session coverage fails validation. A filled gap could manufacture a zero return at precisely the time the event study is trying to measure an unusual move.</p>
      <p>Box-office totals are descriptive metadata. Their later availability makes them unsuitable for selecting the sample, weighting events, or predicting expected returns at release time. Vendor revisions and adjustment semantics remain explicit limitations of the frozen snapshot.</p>
    </ArticleSection>
    <ArticleSection id="estimator" title="Specify the primary estimator and its uncertainty">
      <p>The primary endpoint is the equal-weight mean film-level cumulative abnormal return over sessions −1 through +1. For each film, OLS fits AMC returns on an intercept and SPY in sessions −250 through −30, leaving a gap before the event.</p>
      <CodeBlock filename="Market-model event-study definition">{`AR[i,t] = AMC_return[t] - alpha[i] - beta[i] * SPY_return[t]
CAR[i]  = sum(AR[i,t] for t in [-1, 0, +1])
mean_CAR = mean(CAR across the four films)`}</CodeBlock>
      <p>The plan allows IPO-truncated estimation only with at least 120 complete observations, preserving Interstellar transparently. The film is the observational unit; pooling its daily rows as independent film events would inflate the apparent sample.</p>
      <p>The primary reference is a two-sided film-level t test and 95% interval. Exact sign-flip and Wilcoxon checks, plus a seeded film bootstrap, supplement it. With four events, the smallest possible two-sided sign-flip p-value is 0.125. More daily rows cannot remove that event-count constraint.</p>
    </ArticleSection>
    <ArticleSection id="robustness" title="Lock alternatives before choosing a story">
      <p>Six return windows, alternate market/peer controls, return definitions, leave-one-out checks, pandemic and high-volatility exclusions, and alternate release dates are retained. Holm corrections make the test families visible. The main result is not replaced by whichever window looks strongest.</p>
      <p>Year/weekday placebos refit the same model at eligible background dates and exclude known release neighborhoods. They ask about unusual timing under a selected reference distribution; they do not randomize film releases or isolate a director's causal effect.</p>
      <p>The difficult issue at this stage is information timing: film outcomes, corporate actions, missing prices, and anticipated dates all affect what the eventual model can mean. The response is an explicit population, frozen inputs, and a specification ledger. <a href="/blog/projects/nolan-amc-event-study/part-2-event-study">Part 2</a> implements and executes that plan, where two reasonable tests produce different answers.</p>
    </ArticleSection>
    <ResearchSources source={nolanSources.protocol} />
  </>;
}

const protocol: BlogUpdate = {
  slug: "part-1-protocol-and-data",
  title: "Part 1: Defining the question and freezing the data",
  summary: "Fix the four-film population, trading-session alignment, market-model endpoint, and robustness family before viewing effects. Preserve source snapshots and make missing data explicit.",
  date: nolanSources.protocol.date,
  category: "Research design",
  readingMinutes: 4,
  tags: ["Event studies", "Data provenance", "Research design"],
  sections: [{id:"population",title:"Four eligible films"},{id:"data",title:"Frozen inputs and missing data"},{id:"estimator",title:"The primary estimator"},{id:"robustness",title:"Locked robustness checks"},{id:"sources",title:"Commits and research records"}],
  Content: Protocol,
};
export default protocol;
