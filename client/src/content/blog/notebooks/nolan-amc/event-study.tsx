import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection, CodeBlock } from "@/components/blog/article-blocks";
import { nolanSources, ResearchRevision, ResearchSources } from "./sources";

function EventStudy() {
  return <>
    <p className="article-lead">The four release-window estimates were all positive. The harder result was that the film-level test and the matched-date placebo gave very different answers.</p>
    <ResearchRevision source={nolanSources.eventStudy} />
    <ArticleNote>This stage implements and executes the equity study, diagnostics, and reproducible notebook. It establishes neither a director-specific causal effect nor an options strategy. The recorded validation belongs to the September 16 research snapshot.</ArticleNote>
    <ArticleSection id="implementation" title="Build the estimator and test its scientific assumptions">
      <p>The pipeline separates ingestion, exchange-calendar preprocessing, event inference, diagnostics, conditional volatility, and figure generation. Tests target date alignment, no future mean-fit leakage, return identities, independent CAR variance calculations, missing observations, and matched-placebo exclusions.</p>
      <p>The methodology extension adds heavy-tail and dependence diagnostics, ordinary versus HAC coefficient uncertainty, and Student-t GARCH/GJR fits on pre-event market-model residuals. Volatility parameters are frozen before the gap and updated using the previous residual, so today's shock does not enter today's forecast.</p>
      <p>A short sensitivity window exposed a specification detail: sessions −120 through −20 contain 101 observations, so the main model's minimum of 120 could never apply there. The implementation records a 100-observation threshold for that sensitivity rather than silently changing the primary estimator.</p>
    </ArticleSection>
    <ArticleSection id="results" title="Report the large estimate with its wide interval">
      <div className="article-table-scroll"><table>
        <caption>Saved primary results, window [−1,+1], from the committed study tables.</caption>
        <thead><tr><th>Quantity</th><th>Recorded estimate</th></tr></thead>
        <tbody>
          <tr><td>Mean across four film CARs</td><td>+16.12%</td></tr>
          <tr><td>Film-level standard error</td><td>7.63%</td></tr>
          <tr><td>95% t interval</td><td>−8.15% to +40.40%</td></tr>
          <tr><td>Two-sided film-level p</td><td>0.1249</td></tr>
          <tr><td>Six-window Holm-adjusted p</td><td>0.6247</td></tr>
          <tr><td>Matched year/weekday placebo p</td><td>0.0070</td></tr>
        </tbody>
      </table></div>
      <p>The primary test does not reject zero at 5%, and the interval includes losses. That is not proof of no effect. The placebo result says the observed timing is unusual relative to its selected background dates, conditional on exchangeability that has not been established.</p>
      <p>I retained both answers because they use different reference distributions. Post-hoc removal of Oppenheimer raises the placebo p-value to about 0.1138. A locally volatility-matched Oppenheimer pool is empty, so that stress test is marked unavailable rather than forced into existence.</p>
      <figure>
        <a href="/blog/nolan-amc/individual-events.png"><img src="/blog/nolan-amc/individual-events.png" alt="AMC adjusted-price and cumulative abnormal-return paths around the four film releases; Tenet and Oppenheimer show much larger movements than the earlier films." loading="lazy" width="2023" height="916" /></a>
        <figcaption>Original study figure from the executed snapshot. The right panel accumulates from session −10; the primary table above uses only sessions −1 through +1. Open the image for full resolution.</figcaption>
      </figure>
    </ArticleSection>
    <ArticleSection id="adjustments" title="Adjusted prices did not reconstruct shareholder wealth">
      <p>The vendor's AMC adjustment did not fully reconstruct the APE distribution as total shareholder wealth. Oppenheimer's default estimation sample includes that event, and wider windows encounter conversion and financing changes.</p>
      <p>I flagged affected estimates and retained post-APE estimation alternatives. Inventing missing APE prices would create a different unsupported dataset. The limitation remains attached to the results; the word “adjusted” cannot do the work of a corporate-action reconciliation.</p>
      <p>Tenet overlaps pandemic reopening, while Oppenheimer overlaps Barbie and AMC litigation/financing news. SPY and Cinemark controls help describe sensitivity, but cannot identify all those issuer-specific shocks.</p>
    </ArticleSection>
    <ArticleSection id="volatility" title="Keep the unstable volatility fit visible">
      <p>Eight GARCH/GJR fits converge, but one reaches the covariance-stationarity boundary. I retained that fit with its flag rather than tuning or dropping it until it looked stable. Convergence alone does not establish stable parameters or forecast skill.</p>
      <p>These models describe market-adjusted residual risk. Their standardized CARs remain conditional diagnostics with short estimation histories. They do not add independent films, remove confounding, or turn residual volatility into option-implied volatility.</p>
    </ArticleSection>
    <ArticleSection id="reproduction" title="A fresh environment revealed hidden dependency assumptions">
      <p>A clean install exposed an incompatibility between the selected notebook exporter and the newer Markdown parser, plus a plotting-parser mismatch. The recorded remedy pins Mistune 2.0.4 and pyparsing 3.1.2 and saves the full resolved environment.</p>
      <p>The delivered snapshot executes 21 code cells in a fresh Python 3.12.7 kernel, saves the notebook and HTML, passes 10 scientific tests, and validates 13 embedded figures plus 26 PNG/SVG exports. Independent headline arithmetic checks the saved mean, standard error, and p-value. GARCH artifacts use explicit tolerances for optimizer differences across environments.</p>
      <CodeBlock filename="Recorded reproduction sequence at the event-study snapshot">{`python scripts/run_notebook.py
python -m pytest -q
python scripts/validate_artifacts.py
python -m pip check`}</CodeBlock>
      <p>The default analysis uses checksum-verified offline data. Refreshing vendor inputs creates a new snapshot and can change results. <a href="/blog/projects/nolan-amc-event-study/part-3-attention-and-confounders">Part 3</a> then investigates overlapping attention and company events without replacing the original primary findings.</p>
    </ArticleSection>
    <ResearchSources source={nolanSources.eventStudy} />
  </>;
}

const eventStudy: BlogUpdate = {
  slug: "part-2-event-study",
  title: "Part 2: Executing the study and confronting conflicting tests",
  summary: "Implement CAR inference, placebos, GARCH diagnostics, and clean-kernel reproduction. A large mean, a wide interval, and a small placebo p-value require different interpretations; corporate-action and dependency problems stay visible.",
  date: nolanSources.eventStudy.date,
  category: "Event inference",
  readingMinutes: 5,
  tags: ["Python", "Statistical inference", "GARCH"],
  sections: [{id:"implementation",title:"Implementation and scientific tests"},{id:"results",title:"Conflicting reference distributions"},{id:"adjustments",title:"The APE adjustment limitation"},{id:"volatility",title:"Volatility fit boundaries"},{id:"reproduction",title:"Clean-environment reproduction"},{id:"sources",title:"Commits and research records"}],
  Content: EventStudy,
};
export default eventStudy;
