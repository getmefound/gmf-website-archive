export type ClientHubStatus = "done" | "working" | "needed" | "locked";

export type ClientChecklistItem = {
  label: string;
  owner: string;
  status: ClientHubStatus;
  detail: string;
};

export type ClientUploadRequest = {
  label: string;
  status: ClientHubStatus;
  detail: string;
};

export type ClientAgentStep = {
  agent: string;
  job: string;
  output: string;
};

export type ClientMetric = {
  label: string;
  value: string;
  sub: string;
};

export type ClientHubProfile = {
  slug: string;
  businessName: string;
  ownerName: string;
  plan: "Review Automation" | "AI Visibility" | "Client Setup";
  statusLabel: string;
  website: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  logoText: string;
  brandNote: string;
  protection: "Not enabled" | "Requested" | "Enabled";
  managerSummary: string;
  nextClientAction: string;
  checklist: ClientChecklistItem[];
  metrics: ClientMetric[];
  uploadRequests: ClientUploadRequest[];
  reviews: {
    googleStatus: string;
    reviewLinkStatus: string;
    requestRule: string;
    proof: string;
  };
  aiVisibilityPreview: ClientMetric[];
  agentSteps: ClientAgentStep[];
};

const sharedAgentSteps: ClientAgentStep[] = [
  {
    agent: "Manager",
    job: "Receives the signup or intake signal.",
    output: "Tells the team what is ready, what is missing, and what should happen next.",
  },
  {
    agent: "Local Visibility Manager",
    job: "Checks Google Business Profile access and profile health.",
    output: "Returns access status, public profile gaps, screenshots needed, and safe update recommendations.",
  },
  {
    agent: "Reviews Manager",
    job: "Prepares the review request plan.",
    output: "Confirms who should receive review requests, who should not, and when requests go out.",
  },
  {
    agent: "GHL Expert",
    job: "Builds and verifies the HighLevel workflow.",
    output: "Checks contacts, custom fields, workflow trigger, sender, logs, and keeps HighLevel AI off.",
  },
  {
    agent: "Systems Director",
    job: "Watches access, cost, errors, and automation risk.",
    output: "Escalates only if something can break delivery, billing, or client trust.",
  },
];

export const CLIENT_HUBS: ClientHubProfile[] = [
  {
    slug: "abc-business",
    businessName: "ABC Business",
    ownerName: "Business Owner",
    plan: "Review Automation",
    statusLabel: "Setup in progress",
    website: "https://abcbusiness.com",
    phone: "(555) 010-0199",
    email: "owner@abcbusiness.com",
    location: "East Coast",
    category: "Local service business",
    logoText: "AB",
    brandNote: "Logo can be auto-checked from the website first. Uploaded brand files always win.",
    protection: "Requested",
    managerSummary:
      "We have enough to start setup. The only client-side item left is confirming Google Business Profile access and uploading the latest customer/job list.",
    nextClientAction: "Confirm GBP access and upload recent completed jobs.",
    checklist: [
      {
        label: "Business info confirmed",
        owner: "Manager",
        status: "done",
        detail: "Name, website, phone, email, category, and service area are on file.",
      },
      {
        label: "Google Business Profile access",
        owner: "Local Visibility Manager",
        status: "needed",
        detail: "Client should add AOH as Manager under People and access. No password sharing.",
      },
      {
        label: "Logo and brand",
        owner: "Press",
        status: "working",
        detail: "Agent checks website favicon, metadata, and public brand assets first. Client can upload a better logo.",
      },
      {
        label: "Google review link",
        owner: "Local Visibility Manager",
        status: "working",
        detail: "Review link is captured after profile access or public profile verification.",
      },
      {
        label: "Recent customer/job list",
        owner: "Reviews Manager",
        status: "needed",
        detail: "Client uploads completed jobs, invoices, or customers who should receive review requests.",
      },
      {
        label: "Review request message",
        owner: "Coach",
        status: "working",
        detail: "Simple email request is drafted in the business voice before first send.",
      },
      {
        label: "GHL workflow setup",
        owner: "GHL Expert",
        status: "working",
        detail: "Workflow is prepared after contacts and review link are confirmed.",
      },
      {
        label: "Test request",
        owner: "Auditor",
        status: "needed",
        detail: "One test review request is sent before the client is marked live.",
      },
      {
        label: "Client live",
        owner: "Manager",
        status: "needed",
        detail: "Manager marks this green after the test request and proof checks pass.",
      },
    ],
    metrics: [
      { label: "Review requests", value: "0", sub: "waiting on customer list" },
      { label: "Google access", value: "Needs confirm", sub: "client invite step" },
      { label: "Workflow", value: "Draft", sub: "not sending yet" },
      { label: "Owner action", value: "2 items", sub: "GBP access + list" },
    ],
    uploadRequests: [
      {
        label: "Recent completed jobs or customers",
        status: "needed",
        detail: "Spreadsheet, export, invoices, or even a clean list from email is fine.",
      },
      {
        label: "Logo or brand files",
        status: "working",
        detail: "Optional if the website has a clear logo. Upload only if the auto-check is wrong.",
      },
      {
        label: "Do-not-contact notes",
        status: "needed",
        detail: "Names, customers, job types, or situations that should never receive a review request.",
      },
      {
        label: "Best contact for approvals",
        status: "done",
        detail: "Manager sends only setup blockers and final ready summaries.",
      },
    ],
    reviews: {
      googleStatus: "Access pending",
      reviewLinkStatus: "Being verified",
      requestRule: "Email request after completed work. SMS is an AI Visibility upgrade.",
      proof: "Manager will show first test request, workflow proof, and review link proof before launch.",
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Locked", sub: "preview scan available with upgrade" },
      { label: "Review replies", value: "Locked", sub: "AI drafts in client voice" },
      { label: "Local ranking gaps", value: "Locked", sub: "monthly visibility report" },
      { label: "Competitor watch", value: "Locked", sub: "who is gaining attention" },
    ],
    agentSteps: sharedAgentSteps,
  },
  {
    slug: "ai-outsource-hub",
    businessName: "AI Outsource Hub",
    ownerName: "Mike Egidio",
    plan: "Client Setup",
    statusLabel: "Client-zero test",
    website: "https://aioutsourcehub.com",
    phone: "(877) 521-2224",
    email: "mike@aioutsourcehub.com",
    location: "United States",
    category: "AI automation and growth services",
    logoText: "AOH",
    brandNote: "AOH logo is already available from the website assets.",
    protection: "Not enabled",
    managerSummary:
      "This is the practice client hub for building the client workflow before real client volume arrives.",
    nextClientAction: "Use AOH as the first full test before selling this flow.",
    checklist: [
      {
        label: "Business info confirmed",
        owner: "Manager",
        status: "done",
        detail: "AOH identity, website, phone, and contact are known.",
      },
      {
        label: "Google Business Profile access",
        owner: "Local Visibility Manager",
        status: "done",
        detail: "Client-zero access is already confirmed.",
      },
      {
        label: "Logo and brand",
        owner: "Press",
        status: "done",
        detail: "AOH logo files are in the website assets.",
      },
      {
        label: "Google review link",
        owner: "Local Visibility Manager",
        status: "working",
        detail: "Capture and store the review link for the AOH practice run.",
      },
      {
        label: "Recent customer/job list",
        owner: "Reviews Manager",
        status: "needed",
        detail: "Use a safe test list first. Do not message real customers until approved.",
      },
      {
        label: "Review request message",
        owner: "Coach",
        status: "working",
        detail: "Draft the starter message for Mike's approval.",
      },
      {
        label: "GHL workflow setup",
        owner: "GHL Expert",
        status: "working",
        detail: "Check sender, workflow, logs, and HighLevel AI toggles off.",
      },
      {
        label: "Test request",
        owner: "Auditor",
        status: "needed",
        detail: "Send one safe test request before live launch.",
      },
      {
        label: "Client live",
        owner: "Manager",
        status: "needed",
        detail: "Manager reports ready after the proof checks pass.",
      },
    ],
    metrics: [
      { label: "Review requests", value: "Test only", sub: "no real sends yet" },
      { label: "Google access", value: "Confirmed", sub: "AOH profile" },
      { label: "Workflow", value: "Checking", sub: "GHL Expert owns" },
      { label: "Owner action", value: "1 item", sub: "approve first safe test" },
    ],
    uploadRequests: [
      {
        label: "Safe test contact list",
        status: "needed",
        detail: "Use internal test contacts before real AOH customers.",
      },
      {
        label: "Profile screenshots",
        status: "working",
        detail: "Access proof, edit area proof, and draft-before-publish proof.",
      },
      {
        label: "Do-not-contact notes",
        status: "done",
        detail: "No public customer messaging until Mike approves.",
      },
      {
        label: "Best contact for approvals",
        status: "done",
        detail: "Mike receives final Manager summaries.",
      },
    ],
    reviews: {
      googleStatus: "Access confirmed",
      reviewLinkStatus: "Needs capture",
      requestRule: "Test internally first. Public customer sends require Mike approval.",
      proof: "Manager needs screenshots and one safe GHL test before this becomes the client template.",
    },
    aiVisibilityPreview: [
      { label: "ChatGPT visibility", value: "Custom", sub: "AOH internal testing" },
      { label: "Review replies", value: "Locked", sub: "manual approval only" },
      { label: "Local ranking gaps", value: "Pending", sub: "profile scan next" },
      { label: "Competitor watch", value: "Pending", sub: "AI Visibility lane" },
    ],
    agentSteps: sharedAgentSteps,
  },
];

export function getClientHub(slug: string) {
  return CLIENT_HUBS.find((client) => client.slug === slug);
}

export function statusLabel(status: ClientHubStatus) {
  if (status === "done") return "Done";
  if (status === "working") return "Working";
  if (status === "needed") return "Needed";
  return "Locked";
}

export function statusClasses(status: ClientHubStatus) {
  if (status === "done") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "working") return "border-sky-200 bg-sky-50 text-sky-800";
  if (status === "needed") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-slate-200 bg-slate-100 text-slate-600";
}
