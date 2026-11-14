/**
 * Illustrative workflow diagrams for employer projects, drawn for this portfolio from scratch.
 * Generic labels only: no screenshots, real data, internal system names, tables, URLs or customer details.
 * `mine` marks the steps Advaita built or contributed to; the rest were built by teammates.
 */
export type Actor = "customer" | "system" | "ops" | "analyst" | "user" | "team";
export type Step = { label: string; detail: string; actor: Actor; mine?: boolean; tags?: string[] };
export type Branch = { after: number; question: string; yes: { label: string; detail: string; mine?: boolean }; no: { label: string; detail: string; mine?: boolean } };
export type Flow = { steps: Step[]; branch?: Branch; caption?: string };

export const flows: Record<string, Flow> = {
  p2r: {
    steps: [
      { actor: "customer", label: "Proof of payment submitted", detail: "A customer raises a case and uploads their proof of payment. The document is queued for processing.", tags: ["Queue"] },
      { actor: "team", label: "Read and extract", detail: "OCR reads the page, then an AI stage pulls out about a dozen fields (amount, currency, references, payer, date, bank) and double-checks itself with a confidence score. Built by teammates.", tags: ["OCR", "LLM"] },
      { actor: "ops", mine: true, label: "Bank statements loaded", detail: "Operations upload bank-statement Excel files per region. Each is archived, staged, validated, de-duplicated and promoted; bad rows are logged without blocking good ones.", tags: ["FastAPI", "PostgreSQL", "Azure"] },
      { actor: "system", mine: true, label: "Match and validate", detail: "An ordered set of decision rules checks for duplicate payments, invoice matches and bank matches, using rule-based reference extraction from bank narrations.", tags: ["Python", "Rules"] },
      { actor: "system", mine: true, label: "Record and show the outcome", detail: "Results land in case records, with OCR results, rule outcomes and a full timeline for each case.", tags: ["PostgreSQL"] },
      { actor: "system", label: "Decision posted", detail: "Approved or rejected status is posted back to the finance system for payment release.", tags: ["Azure"] },
    ],
    branch: {
      after: 3, question: "Confident match?",
      yes: { label: "Auto-release path", detail: "Cases that pass every check move forward without manual work." },
      no: { mine: true, label: "Analyst review", detail: "Analysts work live queues (human review, low confidence, duplicates, on-account), drill into extracted data, rules and invoices, then approve or reject. They can flag extraction issues for improvement." },
    },
    caption: "Steps outlined in the accent colour are the ones I built or contributed to.",
  },
  afr: {
    steps: [
      { actor: "customer", label: "Request arrives", detail: "An invoicing request, often a customer email with payment proof, reaches the assistant." },
      { actor: "team", label: "Read and validate", detail: "Language models read proofs, bills of lading and invoices; a rule engine applies the business rules. Built by teammates.", tags: ["LLM", "Rules"] },
      { actor: "system", mine: true, label: "Check eligibility", detail: "The case must be approved or compliant. The tool works out import or export, finds the eligible bills of lading and checks the prerequisite tasks (falling back to the local task table).", tags: ["FastAPI", "PostgreSQL"] },
      { actor: "system", mine: true, label: "Log every action", detail: "Per-shipment status, the system's responses, who ran the action and the status reason are written to an audit trail.", tags: ["PostgreSQL"] },
      { actor: "system", mine: true, label: "Notify the customer", detail: "Templated emails go out with multiple recipients and attachments. Automated closure emails cover a group of regions, with port mapping by shipment type.", tags: ["FastAPI", "Email"] },
    ],
    branch: {
      after: 2, question: "Prerequisites met?",
      yes: { mine: true, label: "Close the release task", detail: "Closed asynchronously per shipment with a refreshed access token. Compliant cases can close automatically; users can also pick shipments in the UI and confirm." },
      no: { mine: true, label: "Skip and explain", detail: "Closed, skipped, failed and already-closed shipments each get a clear status, and invalid actions are disabled in the UI." },
    },
    caption: "Plus: natural-language questions about cases and the document-reading models were built by teammates.",
  },
  cost: {
    steps: [
      { actor: "system", label: "Operational data stored", detail: "Volumes, staff (FTE) allocation and process costs sit in PostgreSQL by month, region, country, product and process.", tags: ["PostgreSQL"] },
      { actor: "system", mine: true, label: "Aggregation APIs", detail: "Exception tracking, positions-trend and geo or organisation-filtered aggregation endpoints. Hierarchy counts fixed so totals match the compliance KPIs.", tags: ["Java 17", "Spring Boot"] },
      { actor: "user", mine: true, label: "Explore dashboards", detail: "CX outcome measures, process catalogue, people overview and usage metrics, with an FTE or cost toggle that keeps your filters.", tags: ["React"] },
      { actor: "user", mine: true, label: "Find root causes", detail: "Compliance and design gaps with KPI strips and a hierarchy drill-down. Parent totals recompute only for relevant tasks.", tags: ["React"] },
      { actor: "user", mine: true, label: "Track and export", detail: "Implementation progress, country progress and Excel or CSV exports for planning.", tags: ["Excel"] },
      { actor: "system", label: "Daily status sync", detail: "A scheduled job marks pending decisions as processed once a position is closed.", tags: ["Scheduler"] },
    ],
    branch: {
      after: 3, question: "Gap to fix?",
      yes: { mine: true, label: "Design the solution", detail: "Enter FTEs to move; the UI splits them into whole and fractional rows with target dates, positions to delete or transfer, reasons and agree/disagree decisions, then saves." },
      no: { label: "Keep monitoring", detail: "Usage and compliance summaries track the area over time." },
    },
  },
  credit: {
    steps: [
      { actor: "system", label: "Daily data load", detail: "Fresh customer and credit data arrives each day." },
      { actor: "system", mine: true, label: "Refresh the data hub", detail: "A refresh API recalculates the scoring text, proposed credit days, cash flow blocked and credit-days impact. I designed the workflow and secured it with bearer tokens and role checks.", tags: ["Spring Boot"] },
      { actor: "analyst", mine: true, label: "Browse customers", detail: "Server-side paging, filters, debounced search and sorting keep large customer sets fast.", tags: ["Vue", "TypeScript"] },
      { actor: "analyst", mine: true, label: "Simulate a policy", detail: "Edit base days and vertical modifiers, run the simulation and see which customers' credit days decrease.", tags: ["Vue"] },
      { actor: "analyst", mine: true, label: "Understand the score", detail: "A scoring-formula popover turns text like “40(program)+15(vertical)+10(volume)-10(overdue)” into a readable breakdown.", tags: ["TypeScript"] },
      { actor: "analyst", mine: true, label: "Export the full dataset", detail: "Numeric-safe Excel exports include every data-hub column plus simulation outputs.", tags: ["Excel"] },
    ],
    caption: "Also: activity-based session timeout, and the cash-flow calculation fixed to use stored values and validated against reference spreadsheets.",
  },
  inland: {
    steps: [
      { actor: "user", mine: true, label: "Enter route details", detail: "A single route in the UI, or many routes in one bulk Excel upload.", tags: ["React", "Vite"] },
      { actor: "system", label: "Estimate distance", detail: "Distance is calculated for every route." },
      { actor: "team", label: "Estimate cost", detail: "A cost model combined with historical-rate analysis produces the estimate. Built by teammates.", tags: ["ML"] },
      { actor: "ops", mine: true, label: "Maintain buy-to-sell mappings", detail: "Create, update and bulk-upsert mappings through the UI and the endpoints behind it.", tags: ["FastAPI", "PostgreSQL"] },
      { actor: "user", mine: true, label: "Download the analysis", detail: "Results on screen and as a downloadable analysis.", tags: ["Excel"] },
      { actor: "system", mine: true, label: "Go live", detail: "Frontend configuration moved from test to production endpoints, with secrets and connectivity coordinated.", tags: ["Docker"] },
    ],
  },
  bhel: {
    caption: "Before: parameters were noted by hand and entered into the database later.",
    steps: [
      { actor: "ops", label: "Shop-floor measurement", detail: "At every stage of making an insulator, parameters are checked and measured." },
      { actor: "ops", mine: true, label: "Capture in the app", detail: "The operator enters the reading straight into the mobile app.", tags: ["Java"] },
      { actor: "system", mine: true, label: "Save to the database", detail: "Readings are stored as they are taken.", tags: ["SQL"] },
      { actor: "analyst", label: "Ready to analyse", detail: "Data is complete and searchable, no longer waiting on manual entry." },
    ],
  },
};
