import type { ControlTone } from "./internal-jobs";

export type ProductStatus = "build-now" | "pilot" | "later";

export type GrowthProductStep = {
  title: string;
  owner: string;
  status: "ready" | "draft" | "guarded" | "manual";
  description: string;
  proof: string;
};

export type GrowthProductSpecialOffer = {
  label: string;
  standardLabel: string;
  standardItems: string[];
  specialLabel: string;
  specialItems: string[];
  price: string;
  bonus: string;
  note: string;
};

export type GrowthProductSourceClaim = {
  label: string;
  claim: string;
  detail: string;
  url: string;
};

export type GrowthProduct = {
  slug: string;
  href: string;
  publicHref?: string;
  name: string;
  shortName: string;
  type: string;
  status: ProductStatus;
  tone: ControlTone;
  headline: string;
  plainEnglish: string;
  idealClient: string[];
  whatClientBuys: string[];
  agentOwners: {
    agent: string;
    role: string;
  }[];
  steps: GrowthProductStep[];
  pros: string[];
  cons: string[];
  guardrails: string[];
  sellAs: string;
  pricingDirection: string;
  specialOffer?: GrowthProductSpecialOffer;
  nextBuild: string[];
  sourceClaims?: GrowthProductSourceClaim[];
  sources: {
    label: string;
    url: string;
  }[];
};

export const GROWTH_PRODUCTS: GrowthProduct[] = [
  {
    slug: "presence-refresh",
    href: "/mike-mc/jobs/presence-refresh",
    publicHref: "/lp/presence-refresh",
    name: "Presence Refresh",
    shortName: "Presence Refresh",
    type: "One-time launch add-on",
    status: "build-now",
    tone: "accent",
    headline: "Make the business look active before we drive new attention to it.",
    plainEnglish:
      "Before Reach sends people to check a business, agents fill obvious inactivity gaps: recent social posts, useful blog posts, profile basics, and proof links.",
    idealClient: [
      "Dead or stale social pages",
      "No recent website/blog content",
      "Good business, weak online proof",
      "Client about to start Cold Email Reach or Social Reach",
    ],
    whatClientBuys: [
      "Short online presence audit",
      "Launch special: 10 catch-up social posts",
      "Launch special: 5 useful blog posts",
      "Light brand cleanup and proof of publish",
      "Morning Brief bonus with proof links and next moves",
      "Recommended next campaign angle",
    ],
    agentOwners: [
      { agent: "Scout", role: "Finds gaps, recent topics, competitors, and customer questions." },
      { agent: "Coach", role: "Sets the angle and makes sure the content sounds like the business." },
      { agent: "Editor", role: "Drafts the blog and social copy." },
      { agent: "Press", role: "Schedules or publishes approved posts and saves proof." },
      { agent: "Systems Director", role: "Checks access, links, and no-risk publish settings." },
    ],
    steps: [
      {
        title: "Audit the business presence",
        owner: "Scout",
        status: "ready",
        description:
          "Check the website, social pages, last post dates, service pages, obvious trust gaps, and competitor activity.",
        proof: "Audit notes, screenshots, and missing-content list.",
      },
      {
        title: "Pick the message angle",
        owner: "Coach",
        status: "ready",
        description:
          "Choose one useful customer-facing theme so the posts and blog are not generic filler.",
        proof: "Approved theme and audience note.",
      },
      {
        title: "Create the fill pack",
        owner: "Editor",
        status: "draft",
        description:
          "Draft the launch-special pack: 10 social posts and 5 useful blog posts that make the business look active without sounding generic.",
        proof: "Draft pack ready for approval.",
      },
      {
        title: "Publish after approval",
        owner: "Press",
        status: "manual",
        description:
          "Post only after client or Mike approval. Save links and screenshots so the client sees what changed.",
        proof: "Published links and proof screenshots.",
      },
      {
        title: "Hand off to Reach",
        owner: "Manager",
        status: "ready",
        description:
          "Use the refreshed content as credibility before Cold Email Reach or Social Reach starts.",
        proof: "Campaign-ready summary and next offer angle.",
      },
    ],
    pros: [
      "Easy for owners to understand.",
      "Low platform risk because it uses approved publishing.",
      "Creates visible before/after proof.",
      "Makes Reach campaigns convert better because prospects see recent activity.",
    ],
    cons: [
      "Not a lead engine by itself.",
      "Can become weak if the client gives no photos, services, or access.",
      "Needs quality control so it does not feel like generic AI filler.",
    ],
    guardrails: [
      "Do not publish without approval.",
      "Do not claim results, awards, licenses, or guarantees the client did not provide.",
      "Use client-owned channels only after access is confirmed.",
      "Keep the blog helpful and specific, not keyword-stuffed.",
    ],
    sellAs:
      "A setup product before Reach: we make sure prospects do not see a stale business when they look you up.",
    pricingDirection:
      "Launch special: $997 one time for 10 social posts, 5 blog posts, and the Morning Brief bonus. After proof is strong, move this toward $1,500-$2,500 depending on channels, blog depth, and publishing access.",
    specialOffer: {
      label: "Founding client special",
      standardLabel: "Normal starter pack",
      standardItems: ["5 social posts", "1 blog post"],
      specialLabel: "Launch special",
      specialItems: ["10 social posts", "5 blog posts"],
      price: "$997 one time",
      bonus: "Morning Brief included: what changed, proof links, and the next Reach move.",
      note:
        "Use AOH as client zero first, then sell this as the fast credibility setup before Cold Email Reach or Social Reach.",
    },
    nextBuild: [
      "Run AOH first so Mike has a real before/after to show clients.",
      "Create intake checklist for services, tone, photos, access, and approval contact.",
      "Create before/after proof template.",
      "Create 10-post plus 5-blog launch-special package.",
      "Add Morning Brief proof cards after publish.",
      "Use the public offer page in sales conversations.",
      "Add proof links into Mission Control after publish.",
    ],
    sourceClaims: [
      {
        label: "Current activity",
        claim: "Recent activity is a visible trust signal.",
        detail:
          "Tufts social media guidance says pages should be checked regularly and non-X channels can reasonably post 3-5 times weekly; that supports the need for a current-looking feed.",
        url: "https://communications.tufts.edu/social-media-best-practices/",
      },
      {
        label: "Blog value",
        claim: "Useful blogs still support awareness, engagement, leads, SEO, and expertise.",
        detail:
          "HubSpot's 2025 blogging report found marketers still use blogs for brand awareness, customer engagement, lead generation, SEO, and thought leadership.",
        url: "https://blog.hubspot.com/marketing/state-of-blogging",
      },
      {
        label: "Market pricing",
        claim: "This launch special is intentionally aggressive versus normal SMB social packages.",
        detail:
          "Sprout Social says small-business social packages commonly bundle monthly posts, scheduling, and reporting; freelancers often run $500-$3,000/month and agencies $2,000+/month.",
        url: "https://sproutsocial.com/insights/social-media-packages-small-business/",
      },
      {
        label: "Content price anchor",
        claim: "Bulk content competitors can price posts and blogs cheaply, so AOH must win on speed, proof, and Reach connection.",
        detail:
          "Socinova publicly lists bulk graphic posts and SEO blogs as low-cost content products, which makes our proof/reporting and campaign handoff the differentiator.",
        url: "https://socinova.com/value-pricing/",
      },
    ],
    sources: [
      {
        label: "Tufts social media best practices",
        url: "https://communications.tufts.edu/social-media-best-practices/",
      },
      {
        label: "HubSpot 2025 blogging report",
        url: "https://blog.hubspot.com/marketing/state-of-blogging",
      },
      {
        label: "Content Marketing Institute 2025 B2B benchmarks",
        url: "https://contentmarketinginstitute.com/b2b-research/b2b-content-marketing-trends-research-2025",
      },
      {
        label: "Sprout Social small business social packages",
        url: "https://sproutsocial.com/insights/social-media-packages-small-business/",
      },
      {
        label: "Eclincher 2026 social media pricing",
        url: "https://www.eclincher.com/articles/social-media-management-pricing-rates-and-costs-for-2026",
      },
      {
        label: "Socinova value content pricing",
        url: "https://socinova.com/value-pricing/",
      },
    ],
  },
  {
    slug: "social-reach",
    href: "/mike-mc/jobs/social-reach",
    name: "Social Reach",
    shortName: "Social Reach",
    type: "Recurring Reach upsell",
    status: "pilot",
    tone: "warm",
    headline: "Find useful social conversations and help the business show up without sounding spammy.",
    plainEnglish:
      "Agents listen for relevant conversations in approved groups, feeds, and posts, draft helpful responses, and route only the best opportunities for human approval.",
    idealClient: [
      "B2B or local service businesses where trust matters",
      "Owners with useful expertise but no time to watch social conversations",
      "Companies already selling through relationships and referrals",
      "Clients who can approve comments quickly",
    ],
    whatClientBuys: [
      "Approved group/source watchlist",
      "Conversation opportunity list",
      "Helpful comment drafts",
      "Light social selling playbook",
      "Weekly opportunity and outcome report",
    ],
    agentOwners: [
      { agent: "Scout", role: "Finds approved communities, posts, and customer questions." },
      { agent: "Sales Manager", role: "Decides which conversations are worth engaging." },
      { agent: "Coach", role: "Drafts helpful comments in the client's voice." },
      { agent: "Press", role: "Queues approved responses and proof of engagement." },
      { agent: "Systems Director", role: "Keeps platform rules, automation risk, and approval gates visible." },
    ],
    steps: [
      {
        title: "Build the watchlist",
        owner: "Scout",
        status: "manual",
        description:
          "Client or AOH identifies approved groups, pages, hashtags, posts, newsletters, and LinkedIn feeds to watch.",
        proof: "Watchlist with source, platform, access owner, and posting rules.",
      },
      {
        title: "Find useful conversations",
        owner: "Scout",
        status: "guarded",
        description:
          "Agents surface questions where the business can help. No mass scraping, fake accounts, or auto-commenting.",
        proof: "Opportunity queue with links and reason to engage.",
      },
      {
        title: "Score the opportunity",
        owner: "Sales Manager",
        status: "draft",
        description:
          "Keep only conversations with real buyer pain, local fit, or authority-building value.",
        proof: "Score: help value, fit, urgency, and promotion risk.",
      },
      {
        title: "Draft a helpful response",
        owner: "Coach",
        status: "draft",
        description:
          "Draft helpful comments that answer first and only lightly offer help when it is natural.",
        proof: "Draft response plus why it is safe to post.",
      },
      {
        title: "Human posts or approves",
        owner: "Client or AOH owner",
        status: "manual",
        description:
          "A real human posts from the real account. The agent does not auto-comment on LinkedIn or Facebook.",
        proof: "Approved/post link saved.",
      },
      {
        title: "Track trust signals",
        owner: "Manager",
        status: "draft",
        description:
          "Track replies, likes, DMs, referral comments, and questions that should feed future Reach campaigns.",
        proof: "Weekly Social Reach summary.",
      },
    ],
    pros: [
      "Warmer than cold outreach because it starts where people already talk.",
      "Builds authority before selling.",
      "Creates customer-language insights for Cold Email Reach, blogs, and ads.",
      "Can become a premium monthly service if it produces conversations.",
    ],
    cons: [
      "Harder to measure than cold email.",
      "Platform risk is real if automated badly.",
      "Needs human approval and good judgment.",
      "Some groups ban promotion, so comments must lead with help.",
    ],
    guardrails: [
      "No auto-commenting, auto-liking, fake accounts, or mass scraping.",
      "Use approved groups and approved client accounts only.",
      "Human approval before posting during v1.",
      "Answer the question first. Pitch only when it naturally fits.",
      "Respect group rules and remove any source that does not allow business participation.",
    ],
    sellAs:
      "A monthly relationship-building Reach product: we find the conversations your future customers are already having and help you show up usefully.",
    pricingDirection:
      "Pilot manually first. If it works, sell at $500-$1,500/month depending on sources watched, comment volume, and approval speed.",
    nextBuild: [
      "Run AOH pilot with 10 approved LinkedIn/Facebook/community sources.",
      "Create opportunity scoring sheet.",
      "Create comment approval queue.",
      "Track DMs, replies, booked calls, and useful market language.",
    ],
    sources: [
      {
        label: "Hootsuite Social Trends 2025",
        url: "https://www.hootsuite.com/en-gb/research/social-trends",
      },
      {
        label: "Sprout Social 2025 Index press summary",
        url: "https://sproutsocial.com/insights/press/the-days-of-trend-chasing-are-over-new-research-from-sprout-social-reveals-a-third-of-consumers-think-jumping-on-viral-trends-is-embarrassing-for-brands/",
      },
      {
        label: "LinkedIn prohibited software and automation",
        url: "https://www.linkedin.com/help/linkedin/answer/a1341387/prohibited-software-and-extensions",
      },
      {
        label: "Meta automated data collection terms",
        url: "https://www.facebook.com/legal/automated_data_collection_terms",
      },
    ],
  },
];

export function growthProductBySlug(slug: string) {
  return GROWTH_PRODUCTS.find((product) => product.slug === slug);
}

export function productStatusLabel(status: ProductStatus) {
  if (status === "build-now") return "build now";
  if (status === "pilot") return "pilot";
  return "later";
}
