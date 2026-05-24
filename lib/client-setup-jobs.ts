import type { ClientSetupJobPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords, saveReviewAutomationEvent } from "@/lib/review-automation-store";

export type ClientSetupStepDefinition = {
  key: ClientSetupJobPacket["stepKey"];
  label: string;
  owner: ClientSetupJobPacket["actor"];
  check: string;
};

export const CLIENT_SETUP_STEPS: ClientSetupStepDefinition[] = [
  {
    key: "intake",
    label: "Intake submitted",
    owner: "Manager",
    check: "Business basics, contact, website, and consent are captured.",
  },
  {
    key: "manager_review",
    label: "Manager review",
    owner: "Manager",
    check: "Manager confirms fit, plan, blockers, and assigns the job.",
  },
  {
    key: "gbp_access",
    label: "GBP access",
    owner: "Profile Manager",
    check: "Correct Google Business Profile exists or creation/claim path is recorded.",
  },
  {
    key: "gbp_verification",
    label: "GBP verification",
    owner: "Profile Manager",
    check: "Profile is verified or waiting on the specific client verification method.",
  },
  {
    key: "profile_optimization",
    label: "Profile optimization",
    owner: "Profile Manager",
    check: "Categories, services, hours, website, photos, and description are checked.",
  },
  {
    key: "review_link",
    label: "Review link",
    owner: "Reviews Manager",
    check: "Verified Google review link is captured and saved to the client profile.",
  },
  {
    key: "review_automation",
    label: "Review automation",
    owner: "Reviews Manager",
    check: "Sender, customer source, proof page, suppressions, and first-send gate are ready.",
  },
  {
    key: "systems_safety",
    label: "Systems safety",
    owner: "Systems Director",
    check: "No password sharing; client owns GBP; GMF is Manager unless approved otherwise.",
  },
  {
    key: "auditor_gate",
    label: "Auditor gate",
    owner: "Auditor",
    check: "Proof and client-facing promises are clean before launch.",
  },
  {
    key: "launch_ready",
    label: "Launch ready",
    owner: "Manager",
    check: "Manager marks the job ready or blocked with the next action.",
  },
];

export type ClientSetupJobState = {
  clientSlug: string;
  clientName: string;
  jobId: string;
  events: ClientSetupJobPacket[];
  steps: Array<ClientSetupStepDefinition & {
    status: ClientSetupJobPacket["status"];
    actor: ClientSetupJobPacket["actor"];
    note: string;
    blocker: string;
    nextAction: string;
    proofUrl: string;
    updatedAt: string;
  }>;
  counts: {
    done: number;
    blocked: number;
    waiting: number;
    inProgress: number;
  };
  overallStatus: "ready" | "blocked" | "waiting_on_client" | "in_progress" | "not_started";
  nextAction: string;
};

export async function getClientSetupJob(clientSlug: string, input?: { limit?: number }) {
  const result = await listReviewAutomationRecords({ clientSlug, limit: input?.limit ?? 200 });
  if (!result.ok) return result;

  const events = result.records
    .filter((record) => record.eventType === "client_setup_update")
    .map((record) => record.payload as ClientSetupJobPacket)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

  const state = buildClientSetupJobState(clientSlug, events);
  return { ok: true as const, configured: true as const, state };
}

export async function saveClientSetupUpdate(packet: ClientSetupJobPacket) {
  return saveReviewAutomationEvent("client_setup_update", packet);
}

export function buildClientSetupUpdate(input: Omit<ClientSetupJobPacket, "timestamp"> & { timestamp?: string }) {
  return {
    ...input,
    note: cleanText(input.note, 1000),
    blocker: cleanText(input.blocker, 1000),
    nextAction: cleanText(input.nextAction, 1000),
    proofUrl: cleanText(input.proofUrl, 500),
    timestamp: input.timestamp || new Date().toISOString(),
  } satisfies ClientSetupJobPacket;
}

function buildClientSetupJobState(clientSlug: string, events: ClientSetupJobPacket[]): ClientSetupJobState {
  const latestByStep = new Map<ClientSetupJobPacket["stepKey"], ClientSetupJobPacket>();
  for (const event of events) {
    if (!latestByStep.has(event.stepKey)) latestByStep.set(event.stepKey, event);
  }

  const firstEvent = events[events.length - 1] ?? events[0];
  const clientName = firstEvent?.clientName || clientSlug;
  const jobId = firstEvent?.jobId || `${clientSlug}-setup`;

  const steps = CLIENT_SETUP_STEPS.map((definition) => {
    const latest = latestByStep.get(definition.key);
    return {
      ...definition,
      status: latest?.status ?? "not_started",
      actor: latest?.actor ?? definition.owner,
      note: latest?.note ?? "",
      blocker: latest?.blocker ?? "",
      nextAction: latest?.nextAction ?? "",
      proofUrl: latest?.proofUrl ?? "",
      updatedAt: latest?.timestamp ?? "",
    };
  });

  const counts = {
    done: steps.filter((step) => step.status === "done").length,
    blocked: steps.filter((step) => step.status === "blocked").length,
    waiting: steps.filter((step) => step.status === "waiting_on_client").length,
    inProgress: steps.filter((step) => step.status === "in_progress" || step.status === "review").length,
  };
  const nextStep = steps.find((step) => step.status !== "done");
  const overallStatus = counts.blocked
    ? "blocked"
    : counts.waiting
      ? "waiting_on_client"
      : counts.done === steps.length
        ? "ready"
        : events.length
          ? "in_progress"
          : "not_started";

  return {
    clientSlug,
    clientName,
    jobId,
    events,
    steps,
    counts,
    overallStatus,
    nextAction: nextStep?.nextAction || nextStep?.check || "All setup checks are complete.",
  };
}

function cleanText(value: string, max: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}
