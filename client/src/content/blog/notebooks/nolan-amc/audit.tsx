import type { BlogUpdate } from "@/lib/blog";
import { ArticleNote, ArticleSection } from "@/components/blog/article-blocks";
import { nolanSources, ResearchRevision, ResearchSources } from "./sources";

function ResearchAudit() {
  return <>
    <p className="article-lead">The event study was a useful research foundation, but its charts and volatility models did not make it an options analytics system. I audited that boundary before extending the project.</p>
    <ResearchRevision source={nolanSources.audit} />
    <ArticleNote>October 27 research audit and implementation plan. The existing pipeline was reproduced and numerical reference functions were smoke-tested. Live option ingestion, a complete pricing engine, and an options strategy backtest remain proposed work.</ArticleNote>
    <ArticleSection id="audit" title="Verify the existing foundation before changing its story">
      <p>The review checks the plans, manifests, source modules, tests, saved notebook, and generated results. Thirteen tests pass, and the artifact validator verifies 23 saved executed code cells, 18 sections, and 14 embedded figures. The review does not claim to have rerun Jupyter itself.</p>
      <p>Instead, it independently reruns the offline analytical pipeline into a temporary output root. Saved event tests, film results, attention correlations, and GARCH tables agree within declared tolerances. That establishes reproduction from the same frozen inputs; it is not an independent audit of the market vendor.</p>
      <p>The inventory distinguishes verified calculations, preliminary teaching code, and proposed capabilities. A factor intercept or four positive CARs is not investment-account alpha. No options ledger means return, Sharpe, drawdown, monthly P&L, and win-rate metrics are unavailable, rather than zero.</p>
    </ArticleSection>
    <ArticleSection id="mismatch" title="Residual volatility and option volatility describe different risks">
      <p>The existing GARCH models are fitted to market-model residuals in percentage-return units. Option-implied volatility concerns the underlying payoff through a pricing model. Subtracting the former from the latter would compare different targets.</p>
      <p>The planned response is a separate total-underlying variance forecast with a declared return definition, information cutoff, contract horizon, and annualization. A physical forecast still does not become a risk-neutral price or proof of mispricing. Residual GARCH stays in the original event-study role.</p>
      <p>Corporate-action accounting also remains open. AMC's adjusted common-share series does not reconstruct full APE wealth or adjusted option deliverables. Stock return estimation, hedge cash flows, exercise, and settlement cannot all be represented by one convenient adjusted-price column.</p>
    </ArticleSection>
    <ArticleSection id="findings" title="The audit exposed real numerical failure cases">
      <p>The project pricing demo returns NaNs for a NaN input instead of rejecting it. An inspected reference IV solver can return a bracket midpoint after exhausting its iterations: with zero allowed iterations, a synthetic option generated at volatility 0.20 yields about 2.500000005. A plausible-looking finite result is not evidence of convergence.</p>
      <p>The audit also finds a factor-of-100 vega convention difference: one implementation reports the raw derivative per unit volatility, while the project reports per percentage point. Existing parity and vega checks do not cover every Greek, boundary, exercise convention, or solver failure.</p>
      <p>A single synthetic interior-point smoke check agrees closely with finite differences and IV round trips. That supports further reuse and testing, not broad numerical validation or empirical pricing accuracy. These findings are documented; this commit does not pretend to have repaired the engine.</p>
      <p>The implementation plan calls for explicit failure statuses, finite-value validation, independent prices, parameter grids, multiple finite-difference step sizes, unit checks, and verified convergence. Expiry and zero-volatility limits need separate treatment from Greeks that can be undefined there.</p>
    </ArticleSection>
    <ArticleSection id="gates" title="Use acceptance gates for the next substantial stages">
      <div className="article-table-scroll"><table>
        <caption>Planned extension; these deliverables were not implemented in the audit commit.</caption>
        <thead><tr><th>Stage</th><th>Evidence needed before claiming completion</th></tr></thead>
        <tbody>
          <tr><td>Data and contracts</td><td>Real timestamped bid/ask, expired-contract coverage, synchronized underlying quotes, feed labels, deliverables, and an explicit coverage report.</td></tr>
          <tr><td>Pricing and risk</td><td>Validated prices/Greeks/IV, exercise-appropriate models, documented units and failure states, horizon-matched forecasts, and one real contract reconciled end to end.</td></tr>
          <tr><td>Strategy evaluation</td><td>A frozen chronological protocol, executable cost assumptions, risk-matched baselines, a self-financing cash/position ledger, and reconciled adverse/expiry cases.</td></tr>
        </tbody>
      </table></div>
      <p>Observed quotes, indicative feeds, theoretical prices, and historical estimates must remain distinct in the interface. A midpoint is a marking convention, not an executable fill, and a stale quote must not be labeled live.</p>
      <p>The draft volatility experiment keeps contract selection, hedging, costs, capital, and chronological splits unresolved until data coverage is known. A model becomes useful through validation and equivalent risk-budget comparisons, not an attractive in-sample result.</p>
    </ArticleSection>
    <ArticleSection id="next" title="What this stage changes">
      <p>The output is an audited capability inventory, a set of concrete failure cases, and a staged research design. Existing market data and study results remain unchanged. The options plan is substantial design work, while market-connected analytics and performance results remain future milestones.</p>
      <p>The next research milestone is the data and contract gate. A real, timestamped, reproducible contract sample must establish what can be modeled before an analytics interface or strategy evaluation can make stronger claims.</p>
    </ArticleSection>
    <ResearchSources source={nolanSources.audit} />
  </>;
}

const audit: BlogUpdate = {
  slug: "part-4-options-research-audit",
  title: "Part 4: Auditing the foundation for an options extension",
  summary: "Reproduce the existing research, identify volatility-target and Greek-unit mismatches, and document pricing/IV failure cases. Define data, analytics, and evaluation gates without presenting planned options work as completed.",
  date: nolanSources.audit.date,
  category: "Research audit",
  readingMinutes: 5,
  tags: ["Numerical validation", "Options research", "Research planning"],
  sections: [{id:"audit",title:"Verified foundation and missing capabilities"},{id:"mismatch",title:"Volatility and data mismatches"},{id:"findings",title:"Numerical failure cases"},{id:"gates",title:"Planned acceptance gates"},{id:"next",title:"Outcome of the audit"},{id:"sources",title:"Commits and research records"}],
  Content: ResearchAudit,
};
export default audit;
