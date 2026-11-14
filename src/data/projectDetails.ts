/**
 * Detailed case-study content for employer projects, written from Advaita's own work notes.
 * Deliberately generic: no internal system, repo, table or endpoint names, no teammates' names,
 * and nothing about security weaknesses. Impact figures are Advaita's own statements.
 */
export type Mine = "built" | "contributed" | "team" | "external";
export type Detail = {
  role: string;
  status: string;
  headline?: string;
  problem: string;
  users: string;
  capabilities: { title: string; text: string }[];
  services?: { name: string; role: string; mine: Mine }[];
  contributions: string[];
  impact: { numbers?: { value: string; label: string; projected?: boolean }[]; points: string[] };
  practices?: string[];
};

export const details: Record<string, Detail> = {
  p2r: {
    role: "Full-stack developer: API, analyst UI, bank-statement pipeline and access control",
    status: "Live in production",
    headline: "Live in 13 countries · 10 FTE positions released",
    problem: "Customers send proof of payment so their cargo can be released. Checking every proof against invoices and bank records by hand is slow, error-prone and needs a lot of people.",
    users: "Internal finance analysts, managers and admins, with role-based access.",
    capabilities: [
      { title: "Proof-of-payment intake", text: "Documents are read with OCR and an AI extraction stage that returns structured fields with confidence scores." },
      { title: "Rule-based validation", text: "An ordered set of decision rules checks for duplicates, invoice matches and bank matches before anything is released." },
      { title: "Bank-statement matching", text: "Statements are uploaded per region, parsed with region-specific formats and matched against payments." },
      { title: "Analyst workbench", text: "Live queues for human review, low-confidence, duplicate and on-account cases, with drill-down into extracted data, rules and invoices." },
      { title: "Feedback loop", text: "Analysts flag extraction problems straight from the tool so the extraction can keep improving." },
      { title: "Metrics and SLAs", text: "Dashboards, activity filters and breach flags show how cases are moving." },
    ],
    services: [
      { name: "Analyst UI", role: "Vue 3 + TypeScript review, upload and metrics screens", mine: "built" },
      { name: "API service", role: "FastAPI: cases, uploads, metrics and the access gate", mine: "built" },
      { name: "Evaluation service", role: "Ordered decision rules, duplicate and bank matching", mine: "contributed" },
      { name: "Access service", role: "Approves access and issues tokens", mine: "contributed" },
      { name: "Document ingestion + AI", role: "OCR and LLM field extraction with confidence routing", mine: "team" },
      { name: "Finance system", role: "Invoices in, approve or reject status out", mine: "external" },
    ],
    contributions: [
      "Built bank-statement upload pipelines for several regions: archive, staging tables, validation, duplicate-safe promotion and an upload log, so partial failures keep the good rows and can be diagnosed without touching the database. The same screen can trigger automated reprocessing.",
      "Wrote rule-based payment-reference extraction for region-specific bank narrations to improve matching against proofs, invoices and shipments.",
      "Delivered the case-records and decisions API with backend sorting and pagination, and fixed database query and timeout problems behind intermittent production errors.",
      "Built the Vue 3 / TypeScript screens: bulk upload, existing statements, review queues, case detail (OCR results, validation rules, invoice details, timeline), extraction feedback, metrics, activity filters and SLA display with breach flags.",
      "Integrated single sign-on and role-based access (analyst, manager, admin) with a secure session design, plus access-request and user-listing screens.",
      "Refactored UI and API reads from a legacy results table to the canonical case tables, so the interface and the services agree on one source of truth.",
      "Contributed to the evaluation service: a duplicate-check rule, bank matching, decision ordering for some regions and a rejection refactor.",
      "Hardened the access service (API-key protection on the token endpoint, graceful handling of database failures) and wrote architecture overviews and support runbooks.",
      "Took part in production testing and hypercare for each region going live.",
    ],
    impact: {
      numbers: [
        { value: "13", label: "countries live" },
        { value: "10", label: "FTE positions released so far" },
        { value: "25+", label: "FTE can be released by going live in 60 more countries", projected: true },
      ],
      points: [
        "Operations teams upload large bank-statement files per region and reprocess matching cases themselves, without manual SQL or tech-team help.",
        "One malformed row no longer blocks a whole upload, and support can diagnose partial failures from the upload log.",
        "Analysts work from live queues with drill-down instead of raw database views.",
        "A feedback loop lets analysts surface extraction quality issues directly in the tool.",
      ],
    },
    practices: [
      "Single sign-on with role-based access; session tokens kept out of page scripts and separate secrets per service.",
      "Unit tests across the API and UI, with end-to-end and load-test tooling available.",
      "Structured logs, metrics and dashboards maintained by the team; containerised services built by CI.",
    ],
  },

  afr: {
    role: "Developer: closure automation, audit logging, closure UI and email workflows",
    status: "Live in production",
    headline: "Live in 7 countries · 15 FTE released",
    problem: "Freight can be released once payment is confirmed, but finance agents had to check each request, close the matching tasks one shipment at a time in another system, and write the emails by hand.",
    users: "Finance and customer-experience staff, with data scoped by country. A business-critical application with defined response and resolution targets.",
    capabilities: [
      { title: "Request handling", text: "Invoicing requests, often customer emails with payment proof, are read, validated against business rules and tracked as cases." },
      { title: "Task closure", text: "Eligible freight-release tasks are closed per shipment, automatically for compliant cases or manually with confirmation." },
      { title: "Audit trail", text: "Every closure records its status, the system's response, who ran it and why a shipment was skipped or failed." },
      { title: "Customer emails", text: "Templated emails with attachments, multiple recipients and thread-aware subjects." },
      { title: "Ask in plain English", text: "Staff can ask questions about cases and get answers from dashboards and tables (built by teammates)." },
      { title: "Incident handling", text: "A documented incident flow with severity levels and resolution targets for production support." },
    ],
    services: [
      { name: "Staff UI", role: "React app with the Close action, shipment selection and email preview", mine: "built" },
      { name: "API service", role: "FastAPI: closure endpoints, status, email orchestration", mine: "built" },
      { name: "Core pipeline", role: "Queue-driven processing, rule checks, automatic closure, emails", mine: "contributed" },
      { name: "Email service", role: "Send and preview with attachments and templates", mine: "contributed" },
      { name: "Rule engine + LLM assistant", role: "Validation rules; document reading and case Q&A", mine: "team" },
      { name: "Operations and ERP systems", role: "Where tasks are closed and invoices live", mine: "external" },
    ],
    contributions: [
      "Built the freight-release closure flow across the API, the core pipeline and the UI: endpoints to close and to read status, with checks that the case is approved or compliant, whether the shipment is import or export, which bills of lading are eligible and which prerequisite tasks exist (falling back to the local task table).",
      "Processed closures asynchronously per shipment with token refresh under a lock, returning a clear result for each case and each bill of lading.",
      "Added the audit trail: per-shipment status, the system's responses, who executed the action and a status reason for closed, skipped, failed and already-closed cases.",
      "Built the UI side: a Close action with confirmation, selecting specific shipments, disabling invalid actions and showing task status before closing; plus an invoice-details component.",
      "Added the automatic closure path for compliant cases in the core pipeline, with error isolation so a failed closure never breaks processing.",
      "Extended the email API and service with multipart attachments, multiple recipients, inbound-subject resolution, body formatting and an attachment-aware preview; fixed broken links in automated closure emails; added automated closure emails for a group of regions with port mapping by shipment type.",
      "Built the React front end and container setup for an AI proof-of-payment extraction proof of concept (the extraction itself was a teammate's work).",
      "Wrote the incident and support documentation, and moved the metrics snapshot endpoint into the API.",
    ],
    impact: {
      numbers: [
        { value: "7", label: "countries live" },
        { value: "15", label: "FTE released" },
      ],
      points: [
        "Users close freight-release tasks from the assistant instead of navigating the operations system, once prerequisites are met.",
        "Compliant cases have a hands-off path, lowering routine manual work for finance agents.",
        "Finance and support teams can trace exactly what happened when a closure fails or behaves unexpectedly.",
        "Correct links and content in automated emails reduce confusion and follow-ups.",
      ],
    },
    practices: [
      "Queue-based processing where transient errors retry and permanent ones are dead-lettered with sanitised context.",
      "Per-service containers and CI pipelines; secrets kept in a vault; metrics endpoints on each service.",
    ],
  },

  cost: {
    role: "Full-stack developer, mostly the React UI and the aggregation APIs",
    status: "Going live",
    headline: "Projected 300 FTE savings by end of 2027",
    problem: "Leaders needed a trustworthy, current view of where cost and effort sit across processes and regions, and a single place to plan moving work, instead of scattered spreadsheets and parallel trackers.",
    users: "Logistics and finance stakeholders and operations leaders, plus admins who manage access.",
    capabilities: [
      { title: "Outcome measures", text: "CX outcome cards that use the latest period for FTE, cost per transaction and cost per month." },
      { title: "Process catalogue", text: "Volumes and cost by process, sub-process and task, with filters and exports." },
      { title: "Future Service Model", text: "Outcome, root causes, solution design and implementation progress in one module." },
      { title: "Hierarchy drill-down", text: "Region, area, country, product, process and task, with an FTE or cost toggle that keeps your filters." },
      { title: "People overview", text: "Positions and people data with trend and Excel export." },
      { title: "Usage and access", text: "User metrics, access requests and admin approval." },
    ],
    services: [
      { name: "Analytics UI", role: "React 18 dashboards with grids, charts and Excel export", mine: "built" },
      { name: "Aggregation APIs", role: "Java 17 + Spring Boot REST endpoints", mine: "contributed" },
      { name: "Database", role: "PostgreSQL schema for volumes, FTE allocation and decisions", mine: "external" },
      { name: "Sign-in + mail", role: "Single sign-on and access-request emails", mine: "external" },
      { name: "Platform", role: "Containers on Kubernetes with CI and vaulted secrets", mine: "contributed" },
    ],
    contributions: [
      "Built the largest share of the React UI over more than a year: CX outcome measures, the Future Service Model module (outcome, root causes, solution design, implementation progress), process catalogue, people overview exports, user-access screens, usage-metrics charts and more.",
      "Implemented the FTE / cost toggle across the dashboards with filters that persist, restored cascading region, area and country filters and re-placed the legends and KPI strips.",
      "Moved hierarchy building to a server-side API and recomputed parent totals only for compliance and design tasks, improving both speed and correctness of root-cause trees.",
      "Built the solution-design workflow: whole and fractional FTE-movement rows, target dates, positions to delete or transfer, reasons, decision dropdowns and saving.",
      "On the backend: an exception-tracking API for the process catalogue, a positions monthly-trend API, geo and organisation filtering on volume aggregation, a hierarchy-count fix so totals match the compliance KPIs, and outcome calculations that use the latest month.",
      "Platform hygiene: refactored the Docker and CI pipelines, added readiness probes, addressed a memory problem and replaced hard-coded database credentials with environment-based configuration.",
      "Reviewed the work with stakeholders and iterated on their feedback.",
    ],
    impact: {
      numbers: [{ value: "300", label: "FTE savings by end of 2027, once it goes live", projected: true }],
      points: [
        "Stakeholders get one place to see opportunities split into design and compliance gaps, record solution decisions and monitor implementation.",
        "Execution-ready movement plans are captured in the tool instead of parallel Excel trackers.",
        "Dashboards reflect the current period instead of outdated averages.",
        "Business users can slice the same numbers by FTE or by cost, and by geography, without losing context.",
      ],
    },
    practices: [
      "Unit and component tests on the UI and controller and service tests on the backend; coverage tooling in the build.",
      "Per-environment Kubernetes manifests; secrets from a vault; health endpoints and readiness probes.",
    ],
  },

  credit: {
    role: "Developer: simulation and data-hub UI, calculation fix, export and refresh workflow",
    status: "In production use",
    problem: "Credit and finance teams needed to see how a change in credit policy would affect customers and cash flow before applying it, and to explain the resulting numbers.",
    users: "Credit analysts and finance and risk teams.",
    capabilities: [
      { title: "Policy overview", text: "Simulate policy changes across customer groups." },
      { title: "Program customers", text: "Editable base days and vertical modifiers with a simulate-and-save flow." },
      { title: "Data hub", text: "Server-side paging, filters, search and exports over the full customer set." },
      { title: "Score explanation", text: "A popover that explains each component behind a proposed credit-days change." },
      { title: "Complete-data view", text: "A modal with every field for a customer, including simulation outputs." },
    ],
    services: [
      { name: "UI", role: "Vue + TypeScript simulation and data-hub screens", mine: "built" },
      { name: "APIs", role: "Java Spring Boot scoring, simulation and refresh endpoints", mine: "contributed" },
      { name: "Database", role: "PostgreSQL customer and scoring data", mine: "external" },
    ],
    contributions: [
      "Built and refined the policy-overview, program-customers and data-hub screens with reusable Vue and TypeScript components.",
      "Corrected the cash-flow improvement calculation to use stored proposed values, aligning application results with reference spreadsheet validation across customer groups.",
      "Implemented complete-data exports covering every data-hub column and simulation field, with numbers exported as real numbers.",
      "Built a scoring-formula parser and popover that explains how each component produced the proposed credit days, without recomputing values on the client.",
      "Switched the session timeout from login-based to activity-based and fixed export hooks.",
      "Designed and documented the data-hub refresh API workflow and secured it with bearer-token authentication and role checks.",
    ],
    impact: {
      points: [
        "Analysts explore large customer sets with server-side paging instead of slow client-side tables.",
        "Risk and finance teams can analyse the full dataset offline for sign-off and audit, with no manual clean-up of exported numbers.",
        "Users understand why a customer's proposed credit days changed, which builds trust in the model.",
        "A sensitive recalculation endpoint is restricted to authorised users and jobs.",
      ],
    },
  },

  inland: {
    role: "Contributor: estimator UI, endpoint configuration and documentation",
    status: "Live",
    problem: "Pricing and operations teams needed fast, consistent estimates of inland route costs, in bulk, without editing database tables by hand.",
    users: "Pricing and operations teams.",
    capabilities: [
      { title: "Single estimate", text: "Enter a route and get a cost estimate." },
      { title: "Bulk upload", text: "Estimate many routes from one Excel file." },
      { title: "Buy-to-sell mapping", text: "Maintain mappings through a UI instead of the database." },
      { title: "Analysis download", text: "Historical-rate analysis and downloadable results." },
    ],
    services: [
      { name: "UI", role: "React + Vite: single estimate, bulk upload, buy-to-sell editor", mine: "built" },
      { name: "API", role: "FastAPI endpoints with SQLAlchemy and PostgreSQL", mine: "contributed" },
      { name: "Cost model", role: "ML-backed estimation and historical-rate analysis", mine: "team" },
    ],
    contributions: [
      "Contributed to the React and Vite components for single estimation, bulk upload and the buy-to-sell editor, calling the estimator endpoints.",
      "Moved the frontend configuration from test to production endpoints and helped coordinate secrets and connectivity.",
      "Contributed to documentation of the estimation, historical-analysis and frontend-backend flows.",
    ],
    impact: {
      points: [
        "Moved the estimator from proof of concept to live use by pointing it at production services.",
        "Pricing and operations users estimate single or bulk routes and maintain mappings through a UI rather than direct database edits.",
      ],
    },
  },

  bhel: {
    role: "App developer intern",
    status: "Internship project",
    problem: "On the shop floor, every stage of making an insulator has parameters that were noted down by hand and entered into the database later.",
    users: "Shop-floor operators and the teams analysing production data.",
    capabilities: [
      { title: "Direct capture", text: "Readings are entered in the app as they are taken." },
      { title: "Stored as taken", text: "Data goes straight into the database instead of waiting on manual entry." },
    ],
    contributions: [
      "Studied the production process and identified the manual-capture problem.",
      "Built the mobile application end to end, applying database management, operating-systems knowledge, Java and SQL.",
    ],
    impact: { points: ["Demonstrated how digitising data capture removes a manual step and a source of delay and error in production."] },
  },
};
