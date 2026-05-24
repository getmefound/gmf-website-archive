import { getClientSetupJob } from "@/lib/client-setup-jobs";
import { getReportFlowStatus } from "@/lib/report-flow-status";
import { getIntegrationHealthRollup } from "@/lib/review-integration-health";
import { getReviewReplyDigest } from "@/lib/review-reply-digest";
import { getSmsReadiness } from "@/lib/review-sms-readiness";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type WorkflowStatus = "ready" | "working" | "blocked" | "manual" | "planned";

export type WorkflowAgentStep = {
  agent: string;
  role: string;
  does: string;
  proof: string;
};

export type WorkflowCounter = {
  label: string;
  value: string;
  tone: "accent" | "warm" | "danger" | "muted";
};

export type GmfWorkflow = {
  slug: string;
  name: string;
  oneLine: string;
  description: string;
  status: WorkflowStatus;
  readyCriteria: string[];
  weeklyCheckAgent: string;
  auditAgent: string;
  stalledProtocol: string;
  mikeEscalation: string;
  clientEmailApproval: string;
  coachTraining: string;
  agents: WorkflowAgentStep[];
  counters: WorkflowCounter[];
  links: Array<{ label: string; href: string }>;
};

export const WORKFLOW_DEFINITIONS: Array<Omit<GmfWorkflow, "counters">> = [
  {
    slug: "gmf-client-setup-gbp",
    name: "Launch 01: Client Setup",
    oneLine: "Turns a new business into a tracked setup job with GBP access, review link, safety checks, and launch gate.",
    description:
      "This workflow is the standard onboarding path for GMF and future clients. It starts with intake, moves through Google Business Profile access and review setup, then ends with Manager/Auditor launch readiness.",
    status: "working",
    weeklyCheckAgent: "Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "Auditor flags the stalled step, Manager decides whether the responsible agent needs more information, and the owner agent drafts the client request.",
    mikeEscalation:
      "If the blocker needs a client item, Manager asks Mike to approve the exact client email or to provide a different instruction.",
    clientEmailApproval:
      "Profile Manager drafts GBP access/verification emails. Manager presents them to Mike for approval before sending.",
    coachTraining:
      "Coach owns the plain-English SOP, client instructions, and agent checklist for this setup workflow.",
    readyCriteria: [
      "Client owns or can claim the Google Business Profile.",
      "GMF has Manager access or a documented verification blocker.",
      "Google review link is captured before review requests go live.",
      "Systems Director confirms no password sharing and no ownership hostage risk.",
      "Auditor verifies proof before Manager marks launch ready.",
    ],
    agents: [
      { agent: "Manager", role: "Workflow owner", does: "Opens the setup job, confirms fit and missing info, and keeps the next owner clear.", proof: "Setup job has Manager review event." },
      { agent: "Profile Manager", role: "GBP owner", does: "Checks create/claim/verify/access status and captures profile blockers.", proof: "GBP access and verification steps have notes or proof links." },
      { agent: "Reviews Manager", role: "Review setup owner", does: "Saves the review link and prepares review request proof before first send.", proof: "Review link and proof page are ready." },
      { agent: "Systems Director", role: "Safety owner", does: "Confirms no password sharing, client ownership, and safe access boundaries.", proof: "Systems safety step is review/done." },
      { agent: "Auditor", role: "Final check", does: "Checks proof, blockers, claims, and launch readiness before done.", proof: "Auditor gate event exists." },
    ],
    links: [
      { label: "Setup Jobs", href: "/mike-mc/setup-jobs?client=getmefound" },
      { label: "Client Profile", href: "/mike-mc/clients" },
      { label: "Client Hub", href: "/client/getmefound" },
    ],
  },
  {
    slug: "gmf-review-automation-launch",
    name: "Serve 01: Review Launch",
    oneLine: "Moves uploaded customers through proof, approved send, private feedback, follow-up, and monthly recap.",
    description:
      "This workflow replaces the GHL review automation path with GMF-owned customer upload, proof, sending, private feedback, follow-up, and reporting.",
    status: "ready",
    weeklyCheckAgent: "Reviews Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "If candidates stop moving, Auditor checks storage, sender health, review link, and suppression blockers before Manager escalates.",
    mikeEscalation:
      "Manager asks Mike only when a live send approval, client list question, or sender-risk decision is needed.",
    clientEmailApproval:
      "Reviews Manager drafts any client request for missing customer list or review link; Manager asks Mike to approve it.",
    coachTraining:
      "Coach keeps the client-facing upload instructions and review request language current.",
    readyCriteria: [
      "Verified Google review link exists.",
      "Customer list is checked for duplicates, missing emails, and suppressions.",
      "Proof page preview is reviewed before live send.",
      "Resend sender and Supabase logging are healthy.",
      "Follow-up and recap paths are protected by internal approval.",
    ],
    agents: [
      { agent: "Reviews Manager", role: "Workflow owner", does: "Builds send candidates, checks proof, and controls live-send readiness.", proof: "Proof page shows sendable rows and preview." },
      { agent: "Sorter", role: "List readiness", does: "Cleans customer lists and holds duplicates, missing emails, and suppressions.", proof: "Upload summary shows clean/held rows." },
      { agent: "Systems Director", role: "Sender/storage safety", does: "Checks Supabase, Resend, and protected endpoint health.", proof: "Health endpoints return ok." },
      { agent: "Auditor", role: "Launch QA", does: "Verifies no accidental sends and all sends are logged.", proof: "Send log and proof checks match." },
      { agent: "Manager", role: "Client/status owner", does: "Reports ready, blocked, or needs-client-help status.", proof: "Client hub status is updated." },
    ],
    links: [
      { label: "Proof Page", href: "/mike-mc/review-proof/ai-outsource-hub" },
      { label: "Customer Upload", href: "/client/ai-outsource-hub/customers" },
      { label: "Storage Health", href: "/api/review-automation/storage-health" },
    ],
  },
  {
    slug: "gmf-pos-crm-intake",
    name: "Serve 02: POS Intake",
    oneLine: "Receives customer/job events from uploads or integrations, dedupes them, and holds unsafe records before review sending.",
    description:
      "This workflow is the bridge from client systems into GMF review automation. Manual upload is base; auto-sync is an upgrade with health checks and alerts.",
    status: "ready",
    weeklyCheckAgent: "Systems Director",
    auditAgent: "Auditor",
    stalledProtocol:
      "If events stop or held events rise, Systems Director checks source health and Auditor confirms no bad events entered send candidates.",
    mikeEscalation:
      "Manager asks Mike only when a client POS/admin access email or paid connector decision needs approval.",
    clientEmailApproval:
      "Systems Director drafts POS access/export requests; Manager asks Mike to approve before sending to the client.",
    coachTraining:
      "Coach keeps the POS integration ladder and client explanation current.",
    readyCriteria: [
      "Manual upload path works for every client.",
      "Event idempotency prevents duplicate sends.",
      "Held and missing-email events are visible.",
      "Send-delay gate prevents immediate accidental review requests.",
      "Daily health cron alerts only when attention is needed.",
    ],
    agents: [
      { agent: "Systems Director", role: "Workflow owner", does: "Owns POS/CRM source health, sync alerts, and integration boundaries.", proof: "Integration health page and cron check pass." },
      { agent: "Sorter", role: "Data quality", does: "Checks fields, missing emails, duplicates, and hold reasons.", proof: "Event health counts are clean." },
      { agent: "Reviews Manager", role: "Send candidate owner", does: "Allows only eligible, delayed events into review proof queue.", proof: "Send candidates exclude held/duplicate/not-yet-eligible rows." },
      { agent: "Auditor", role: "Failure guard", does: "Verifies duplicate retries and sync gaps do not create bad sends.", proof: "Dedupe smoke and health rollup pass." },
      { agent: "Manager", role: "Client communication", does: "Turns technical blocker into a client request when needed.", proof: "Approved client request is logged." },
    ],
    links: [
      { label: "GHL Exit Ops", href: "/mike-mc/ghl-exit-ops" },
      { label: "Integration Health", href: "/api/review-automation/integration-health" },
    ],
  },
  {
    slug: "gmf-report-flow",
    name: "Serve 03: Report Delivery",
    oneLine: "Tracks report requests, submitted status, audit links, heatmap links, blockers, and owner summary outside GHL.",
    description:
      "This workflow gives GMF proof and visibility for website/campaign reports without depending on GHL workflow state.",
    status: "ready",
    weeklyCheckAgent: "Reporter",
    auditAgent: "Auditor",
    stalledProtocol:
      "If a report is blocked or missing links, Reporter records the blocker and Auditor checks whether delivery proof exists.",
    mikeEscalation:
      "Manager asks Mike when a prospect/client needs a manually approved report delivery or explanation.",
    clientEmailApproval:
      "Reporter drafts report-delivery or blocker emails; Manager asks Mike to approve if the message goes to a client/prospect.",
    coachTraining:
      "Coach trains Reporter on the plain-English report status language and what not to promise.",
    readyCriteria: [
      "Report request creates a GMF-owned status record.",
      "Audit and heatmap links can be recorded.",
      "Blocked reports have a blocker note.",
      "Owner summary is visible in the report flow room.",
      "No report flow action triggers GHL AI features.",
    ],
    agents: [
      { agent: "Reporter", role: "Workflow owner", does: "Tracks report status, links, blockers, and delivery summary.", proof: "Report Flow page has latest status." },
      { agent: "Systems Director", role: "Endpoint owner", does: "Keeps protected report endpoints and storage working.", proof: "Report ops smoke passes." },
      { agent: "Auditor", role: "Proof owner", does: "Checks no duplicate or secret-bearing report delivery.", proof: "Report activity log is clean." },
      { agent: "Manager", role: "Owner summary", does: "Explains what is ready, blocked, or needs approval.", proof: "Owner summary is current." },
    ],
    links: [
      { label: "Report Flow", href: "/mike-mc/report-flow" },
      { label: "GHL Exit Ops", href: "/mike-mc/ghl-exit-ops" },
    ],
  },
  {
    slug: "gmf-review-replies",
    name: "Serve 04: Review Replies",
    oneLine: "Drafts review replies in the client voice, keeps risky replies human-reviewed, and records approve/reject/posted decisions.",
    description:
      "This workflow replaces review-reply AI inside GHL with a safer GMF-controlled approval process.",
    status: "working",
    weeklyCheckAgent: "Profile Manager",
    auditAgent: "Auditor",
    stalledProtocol:
      "If drafts pile up, Profile Manager flags pending replies and Manager decides whether Mike/client approval is needed.",
    mikeEscalation:
      "Manager asks Mike to approve the exact reply or client email when a high-risk review or automation-level change appears.",
    clientEmailApproval:
      "Profile Manager drafts client-facing review-reply approval requests; Manager presents the exact wording to Mike.",
    coachTraining:
      "Coach maintains voice-profile examples, escalation terms, and safe reply rules.",
    readyCriteria: [
      "Client voice profile exists.",
      "Draft mode starts as draft-only or approval-required.",
      "High-risk topics never auto-post.",
      "Approve/reject/posted decisions are logged.",
      "Google Business Profile posting waits for explicit future approval path.",
    ],
    agents: [
      { agent: "Profile Manager", role: "Workflow owner", does: "Maintains client voice and review reply quality.", proof: "Voice profile and reply workspace are current." },
      { agent: "Reviews Manager", role: "Queue owner", does: "Keeps review reply decisions moving.", proof: "Pending drafts are visible." },
      { agent: "Auditor", role: "Safety owner", does: "Checks high-risk flags and auto-post eligibility.", proof: "Safety flags match review content." },
      { agent: "Manager", role: "Approval owner", does: "Gets Mike/client approval when needed.", proof: "Decision note is logged." },
    ],
    links: [
      { label: "Review Replies", href: "/mike-mc/review-replies/ai-outsource-hub" },
      { label: "Client Editor", href: "/mike-mc/clients" },
    ],
  },
  {
    slug: "gmf-sms-readiness",
    name: "Serve 05: SMS Readiness",
    oneLine: "Tracks A2P, opt-in, STOP handling, and sample-message approval before any SMS review requests go live.",
    description:
      "This workflow keeps SMS as a compliant paid add-on, not a shortcut around carrier rules.",
    status: "planned",
    weeklyCheckAgent: "Systems Director",
    auditAgent: "Auditor",
    stalledProtocol:
      "If SMS remains blocked, Systems Director records which compliance item is missing and Manager decides whether to ask the client.",
    mikeEscalation:
      "Manager asks Mike before sending any client A2P/opt-in request or before approving SMS as a paid add-on.",
    clientEmailApproval:
      "Systems Director drafts A2P/opt-in request emails; Manager asks Mike to approve before sending.",
    coachTraining:
      "Coach keeps the client explanation for why SMS costs extra and cannot bypass compliance.",
    readyCriteria: [
      "A2P brand is approved.",
      "A2P campaign is approved.",
      "Opt-in language is approved.",
      "STOP handling is ready.",
      "Sample SMS is approved before live sending.",
    ],
    agents: [
      { agent: "Systems Director", role: "Workflow owner", does: "Tracks A2P, opt-in, STOP handling, provider readiness, and cost risk.", proof: "SMS readiness checklist has 5/5 ready." },
      { agent: "Reviews Manager", role: "Message owner", does: "Prepares review request wording after compliance clears.", proof: "Sample message is approved." },
      { agent: "Auditor", role: "Compliance guard", does: "Blocks live SMS until every gate is approved.", proof: "Live sending allowed remains false until complete." },
      { agent: "Manager", role: "Client approval", does: "Explains setup fee/monthly add-on and gets approvals.", proof: "Client approval note exists." },
    ],
    links: [
      { label: "GHL Exit Ops", href: "/mike-mc/ghl-exit-ops" },
      { label: "SMS API", href: "/api/review-automation/sms-readiness?client=ai-outsource-hub" },
    ],
  },
];

export async function getWorkflowRuntime(workflow: Omit<GmfWorkflow, "counters">): Promise<GmfWorkflow> {
  const counters = await countersForWorkflow(workflow.slug);
  return { ...workflow, counters };
}

export async function listGmfWorkflows() {
  return Promise.all(WORKFLOW_DEFINITIONS.map(getWorkflowRuntime));
}

export async function getGmfWorkflow(slug: string) {
  const workflow = WORKFLOW_DEFINITIONS.find((item) => item.slug === slug);
  return workflow ? getWorkflowRuntime(workflow) : null;
}

async function countersForWorkflow(slug: string): Promise<WorkflowCounter[]> {
  if (slug === "gmf-client-setup-gbp") {
    const setup = await getClientSetupJob("getmefound");
    if (!setup.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "steps done", value: String(setup.state.counts.done), tone: "accent" },
      { label: "waiting", value: String(setup.state.counts.waiting), tone: setup.state.counts.waiting ? "warm" : "muted" },
      { label: "blocked", value: String(setup.state.counts.blocked), tone: setup.state.counts.blocked ? "danger" : "muted" },
    ];
  }

  if (slug === "gmf-review-automation-launch") {
    const records = await listReviewAutomationRecords({ clientSlug: "ai-outsource-hub", limit: 300 });
    if (!records.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "events", value: String(records.records.length), tone: "accent" },
      { label: "uploads", value: String(records.records.filter((record) => record.eventType === "customer_upload").length), tone: "muted" },
      { label: "send logs", value: String(records.records.filter((record) => record.eventType === "send_log").length), tone: "muted" },
    ];
  }

  if (slug === "gmf-pos-crm-intake") {
    const rollup = await getIntegrationHealthRollup();
    if (!rollup.ok) return [{ label: "health", value: "issue", tone: "danger" }];
    return [
      { label: "clients", value: String(rollup.totalClients), tone: "accent" },
      { label: "attention", value: String(rollup.needsAttention), tone: rollup.needsAttention ? "danger" : "muted" },
      { label: "active sync", value: String(rollup.clients.filter((client) => client.activeAutoSync).length), tone: "warm" },
    ];
  }

  if (slug === "gmf-report-flow") {
    const report = await getReportFlowStatus({ clientSlug: "getmefound" });
    if (!report.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "submitted", value: String(report.counts.submitted), tone: "accent" },
      { label: "ready", value: String(report.counts.reportReady + report.counts.heatmapReady), tone: "accent" },
      { label: "blocked", value: String(report.counts.blocked), tone: report.counts.blocked ? "danger" : "muted" },
    ];
  }

  if (slug === "gmf-review-replies") {
    const digest = await getReviewReplyDigest({ clientSlug: "ai-outsource-hub", days: 30 });
    if (!digest.ok) return [{ label: "storage", value: "issue", tone: "danger" }];
    return [
      { label: "drafts", value: String(digest.counts.drafted), tone: digest.counts.drafted ? "warm" : "muted" },
      { label: "posted", value: String(digest.counts.posted), tone: "accent" },
      { label: "high risk", value: String(digest.counts.highRisk), tone: digest.counts.highRisk ? "danger" : "muted" },
    ];
  }

  if (slug === "gmf-sms-readiness") {
    const sms = await getSmsReadiness("ai-outsource-hub");
    const ready = sms.checklist.filter((item) => item.done).length;
    return [
      { label: "ready", value: `${ready}/5`, tone: sms.ready ? "accent" : "warm" },
      { label: "live send", value: sms.ready ? "yes" : "no", tone: sms.ready ? "accent" : "muted" },
      { label: "blocked", value: sms.ready ? "0" : String(5 - ready), tone: sms.ready ? "muted" : "warm" },
    ];
  }

  return [{ label: "status", value: "manual", tone: "muted" }];
}
