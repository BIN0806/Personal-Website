import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { nolanSources, ResearchRevision, ResearchSources } from "./sources";

function Attention() {
  return <>
    <p className="article-lead">Oppenheimer did not arrive in isolation. Barbie, shared publicity, premium screens, financing litigation, and other company events could all accompany the same market moves.</p>
    <ResearchRevision source={nolanSources.attention} />
    <ArticleNote>This is an exploratory extension specified after the original equity findings and before attention acquisition. It adds a new question and test family; the original event-study tables remain unchanged.</ArticleNote>
    <ArticleSection id="proxy" title="Choose a measurable proxy and state what it misses">
      <p>I expanded the sourced alternative-driver timeline and froze English-Wikipedia readership for Barbie, Oppenheimer, and AMC Theatres. Each series contains 160 UTC calendar days. The analysis uses 106 NYSE sessions from May through September 2023.</p>
      <p>Readership measures pageviews, not unique people, sentiment, U.S. attendance, or ticket demand. Canonical-title and redirect coverage, imperfect bot filtering, retrospective availability, and shared publicity all limit the interpretation. Missing dates fail validation rather than becoming fabricated zeros.</p>
    </ArticleSection>
    <ArticleSection id="timing" title="Use calendar lags without claiming historical availability">
      <p>For session t, the feature compares pageviews from calendar days t−2 and t−3. That allows a full UTC day after counting ends. Weekends remain calendar days, rather than being forward-filled across exchange sessions.</p>
      <CodeBlock filename="Lagged attention growth">{`attention_growth[t] = log1p(pageviews[t - 2 calendar days])
                    - log1p(pageviews[t - 3 calendar days])`}</CodeBlock>
      <p>Differencing reduces the risk of correlating trending attention levels with trending stock prices. This lag is still a retrospective convention, not evidence that the historical API had delivered each observation by a tradable decision time.</p>
    </ArticleSection>
    <ArticleSection id="family" title="Keep all thirteen slope tests in one family">
      <p>The extension reports nine pairwise attention/market-outcome relationships, one Barbie/Oppenheimer co-attention relationship, and three attention coefficients in a joint AMC-return regression. The joint controls include SPY, Cinemark, and weekday indicators.</p>
      <p>Pearson, rank correlations, native-unit slopes, and partial correlations answer related but distinct questions. Slope inference uses HAC covariance with five session lags and a single 13-test Holm correction. Rank correlations remain descriptive; they are not assigned independent-observation p-values for a dependent time series.</p>
      <p>The strongest surviving association is film co-attention: Pearson r≈0.445 and Spearman rho≈0.653, with corrected slope p≈0.0000272. None of the tested attention associations with AMC signed returns, absolute returns, or activity survives that correction. This is a result about these proxies and lags, not proof that publicity has no effect.</p>
      <figure>
        <a href="/blog/nolan-amc/attention-and-confounders.png"><img src="/blog/nolan-amc/attention-and-confounders.png" alt="Three-panel study figure showing Wikipedia readership, AMC returns with overlapping release and corporate-action dates, and pairwise lagged-attention correlations." loading="lazy" width="2026" height="1821" /></a>
        <figcaption>The original extension figure retains the full return range and overlapping event markers. Its heatmap shows correlation estimates; corrected inference is reported in the source table. Open for full resolution.</figcaption>
      </figure>
    </ArticleSection>
    <ArticleSection id="influence" title="Removing an event also changes the question">
      <p>Two influence checks remove the release/court cluster and the split/conversion week separately, yielding 26 estimate-only rows. Those windows use known event dates rather than attention-result thresholds.</p>
      <p>The subtle problem is that removing sessions changes the population and leaves gaps in the time series. Joining the remaining rows and treating them as consecutive would create a different HAC calculation. I therefore report influence estimates without a new significance search or a claim to isolate a pure court effect.</p>
      <p>VIF, rank, conditioning, and adjusted R² expose the joint model's design. The final rank is 10/10. A full-rank design permits estimation; it does not establish exogeneity, eliminate reverse causality, or make Cinemark an unaffected causal control.</p>
    </ArticleSection>
    <ArticleSection id="validation" title="Verify the extension and preserve the original result">
      <p>The delivered notebook executes 23 code cells and includes 14 figures. Thirteen scientific tests pass, including new checks for complete raw attention calendars, lag/no-future timing, independent correlation identities, and the full Holm family.</p>
      <p>The artifact validator independently reconciles ten pairwise correlations and every attention-panel lag. It also confirms that the original primary test table, film-result table, and evidence assessment are byte-for-byte unchanged from the executed event-study snapshot.</p>
      <p>The extension leaves the study more specific about alternative mechanisms, without establishing a reliable Nolan-specific causal effect or exploitable attention signal. <a href="/blog/projects/nolan-amc-event-study/part-4-options-research-audit">Part 4</a> revisits the whole research foundation and defines what an options extension would actually need.</p>
    </ArticleSection>
    <ResearchSources source={nolanSources.attention} />
  </>;
}

const attention: BlogUpdate = {
  slug: "part-3-attention-and-confounders",
  title: "Part 3: Testing attention and overlapping explanations",
  summary: "Add sourced confounders and a 106-session readership study with calendar lags, HAC/Holm inference, and influence checks. Co-attention survives correction; the tested AMC outcome relationships do not.",
  date: nolanSources.attention.date,
  category: "Attention & confounders",
  readingMinutes: 4,
  tags: ["Time series", "Multiple testing", "Research limits"],
  sections: [{id:"proxy",title:"Readership as an imperfect proxy"},{id:"timing",title:"Calendar lags and availability"},{id:"family",title:"The thirteen-test family"},{id:"influence",title:"Influence checks and gaps"},{id:"validation",title:"Validation and unchanged primary results"},{id:"sources",title:"Commits and research records"}],
  Content: Attention,
};
export default attention;
