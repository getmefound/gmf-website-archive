export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How is AOH different from other agencies?",
    a: "No contract, cancel anytime. We give you a free report before you pay a single dollar. We have to earn your trust before we ask for anything.",
  },
  {
    q: "Will AI replies sound fake and hurt me with Google?",
    a: "Generic AI responses do hurt rankings. Ours are different — once your standard plan begins, every reply is written in your specific business voice using your tone profile. Personalized and indistinguishable from something your best employee would write. During the 30-day intro, you reply manually.",
  },
  {
    q: "How much of my time does this take?",
    a: "Less than 10 minutes of setup, then completely hands-off. We handle everything — requests, responses, optimization. You run your business, we handle your reputation.",
  },
  {
    q: "How long before I see results?",
    a: "Review requests start going out within 48 hours of setup. Most clients see new reviews within the first two weeks. Google ranking improvements typically take 60–90 days.",
  },
  {
    q: "Is AI visibility just regular SEO with a new name?",
    a: "Different mechanism entirely. Traditional SEO gets you a spot on Google's list of links. AI visibility gets your business recommended by name when someone asks ChatGPT who's the best plumber near me — that's a recommendation, not a ranking.",
  },
  {
    q: "Why do I need to keep paying monthly?",
    a: "AI search constantly retrains. Google's algorithm keeps changing. Review velocity matters — a business that stops getting reviews looks inactive to both customers and algorithms. Your monthly fee keeps you active, monitored, and found.",
  },
  {
    q: "What if I get a bad review?",
    a: "A professional, calm reply in your voice does more for your reputation than ignoring it. Once your standard plan begins, we draft a reply to every review, positive or negative — you approve before it posts. During the 30-day intro, you handle replies yourself.",
  },
  {
    q: "You're a new company — why should I trust you?",
    a: "We're new and we know it. That's exactly why we don't lock you into contracts, we give you a free audit before you pay anything, and we're transparent about our pricing. We have to earn your business — and we plan to.",
  },
];

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};
