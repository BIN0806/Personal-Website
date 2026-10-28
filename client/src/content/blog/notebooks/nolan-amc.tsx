import type { BlogSetup } from "@/lib/blog";
import protocol from "./nolan-amc/protocol";
import eventStudy from "./nolan-amc/event-study";
import attention from "./nolan-amc/attention";
import audit from "./nolan-amc/audit";

// One entry per substantial research stage. Related implementation/validation
// commits share a post; relocation and housekeeping commits do not get entries.
const nolanAmc: BlogSetup = {
  slug: "nolan-amc-event-study",
  title: "Nolan / AMC Event Study",
  description: "A skeptical study of AMC around Nolan film releases: frozen data, event inference, attention and confounders, and an audited plan for future options research.",
  categories: ["Research design", "Event inference", "Attention & confounders", "Research audit"],
  // Same-day entries retain stage order under the shared stable date sort.
  updates: [audit, attention, eventStudy, protocol],
};

export default nolanAmc;
