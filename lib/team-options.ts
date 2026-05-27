// Strategist-vetted options per surface. Mike picks 1 text + 1 image per surface.
// NO image generation happens until picks are locked.

export type SurfaceKey =
  | "linkedin-company"
  | "facebook"
  | "x"
  | "instagram"
  | "gbp"
  | "mike"
  | "kip"
  | "teri";

export type TextOption = {
  letter: "A" | "B" | "C";
  angle: string;
  bannerOverlay: string;
  taglineOrHeadline?: { label: string; text: string; charLimit?: number };
  bioOrShortDescription?: { label: string; text: string; charLimit?: number };
  about?: { label: string; text: string };
  categories?: string;
};

export type ImageOption = {
  number: 1 | 2 | 3;
  lane: string;
  model: "Imagen 4" | "FLUX Pro 1.1 Ultra" | "Recraft v3";
  prompt: string;
  whyItWorks: string;
};

export type SurfaceOptions = {
  key: SurfaceKey;
  label: string;
  dimensions: string;
  notes?: string;
  textOptions: TextOption[];
  imageOptions: ImageOption[];
};

export const TEAM_COORDINATION_NOTE = `**Important:** Personal LinkedIn banners (Mike / Kip / Teri) must share the SAME image option number (1, 2, or 3) across all three so the team reads as one masthead. Different lanes = three unrelated people.

**Photos:** Mike's existing about-page portrait can drive image-to-image generation. Kip + Teri don't have reference photos in repo yet — model will invent faces unless you supply reference shots before generation.`;

export const SURFACES: SurfaceOptions[] = [
  {
    key: "linkedin-company",
    label: "LinkedIn Company Page",
    dimensions: "1128 × 191",
    textOptions: [
      {
        letter: "A",
        angle: "Money-leak / stat-first hook",
        bannerOverlay: `Phone answering for when you can't.
From $49/mo.`,
        taglineOrHeadline: {
          label: "Tagline (120 char)",
          text: "Done-for-you growth for local businesses. We answer the phone, follow up, and chase reviews — from $49/mo.",
          charLimit: 120,
        },
        about: {
          label: "About (1000 char)",
          text: `Local-business owners lose more money to missed calls and ghosted reviews than to any marketing problem. We fix that. GetMeFound is done-for-you growth for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners who don't have time to babysit software. Four services. From $49/month. No agency retainer. No 40-hour onboarding. No DIY tool you'll never log into again. We set it up, we run it, and the AI answers the phone at 9pm when your competitor's voicemail picks up. Founded by Mike Egidio after watching too many great operators lose to weaker ones who simply replied faster. Built for owners who'd rather run the business than learn another dashboard.`,
        },
      },
      {
        letter: "B",
        angle: "Anti-jargon / founder voice",
        bannerOverlay: `No dashboards. No retainers.
Just done-for-you growth.`,
        taglineOrHeadline: {
          label: "Tagline (120 char)",
          text: "The growth automation your competitor's marketing agency won't sell you — because we charge $49, not $4,900.",
          charLimit: 120,
        },
        about: {
          label: "About (1000 char)",
          text: `Most "AI for small business" is a $300/month dashboard you'll log into twice and never open again. We're the opposite. GetMeFound runs the rest for you — answering after-hours calls, chasing reviews, following up with leads who ghosted — so you never see a dashboard and never lose another customer to a faster competitor. Four services starting at $49/month. Built for plumbers, HVAC techs, dentists, vets, med spas, groomers, and salon owners who are sick of marketing software they don't have time to use. Founder Mike Egidio spent years watching local operators lose to weaker competitors with better follow-up. We sell the follow-up. Done-for-you. Month-to-month. Cancel anytime.`,
        },
      },
      {
        letter: "C",
        angle: "Outcome-first / proof-stacked",
        bannerOverlay: `Your phone rings at 9pm.
Ours picks up.`,
        taglineOrHeadline: {
          label: "Tagline (120 char)",
          text: "Done-for-you phone answering, review engine, and lead follow-up for local businesses. From $49/mo.",
          charLimit: 120,
        },
        about: {
          label: "About (1000 char)",
          text: `Three things kill local-business revenue: missed calls, slow follow-up, and a thin Google review profile. We fix all three. GetMeFound is six done-for-you growth services built specifically for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners. We answer the phone after hours. We text leads back in 60 seconds. We ask every happy customer for a Google review — and intercept the unhappy ones before they post. From $49 a month. We set it up. We run it. You stay in the truck, the chair, the operatory — wherever the money actually gets made. Founded by Mike Egidio. Team of three. No call centers. No outsourced support.`,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: 'Documentary still-life, "operator\'s desk"',
        model: "Imagen 4",
        prompt: `Wide aspect documentary still-life photograph of a local-business owner's desk at end of day: a worn leather work glove, a clipboard with handwritten service tickets, a coffee mug ring on cream paper, an unbranded smartphone face-up showing a missed-call screen, a small forest-green sticky note that reads "called back". Warm desk-lamp lighting from camera-left, deep navy shadows, cream-paper midtones. Shot on Hasselblad, 50mm, shallow depth of field. No people. No screens glowing blue. No futuristic elements.`,
        whyItWorks:
          "Signals \"we get the operator's world\" — every prop is a local-business artifact, not an AI trope.",
      },
      {
        number: 2,
        lane: "Branded typographic / editorial",
        model: "Recraft v3",
        prompt: `Editorial banner composition, dark navy background (#0A1628) with cream (#F8F6F1) serif headline set left-aligned in a Mrs Eaves-style typeface, a single thin forest-green (#2D6A4F) horizontal rule beneath, generous negative space on the right two-thirds of the canvas. Subtle paper-grain texture. Letterpress feel. No imagery, no icons, no gradients. Magazine cover restraint.`,
        whyItWorks:
          'Owns the cream/navy/forest palette as a brand asset. Reads as "established firm" not "AI startup #4,000".',
      },
      {
        number: 3,
        lane: 'Abstract metaphor, "the answered call"',
        model: "FLUX Pro 1.1 Ultra",
        prompt: `Cinematic close-up of a vintage rotary phone handset resting off the cradle on a cream linen surface, a single forest-green telephone cord coiled neatly beside it, soft golden hour window light raking across from the left, deep navy shadow falling to the right. Anamorphic lens, 2.39:1, film grain, no text, no people, no modern technology visible. The composition leaves the right third empty for overlay text.`,
        whyItWorks:
          "A phone answered is the entire pitch. Metaphor lands instantly without showing a screen or a robot.",
      },
    ],
  },

  {
    key: "facebook",
    label: "Facebook Page",
    dimensions: "820 × 312",
    textOptions: [
      {
        letter: "A",
        angle: "Direct benefit / time-saving",
        bannerOverlay: `We answer the phone.
We chase the reviews.
You run the business.`,
        bioOrShortDescription: {
          label: "Short description (255 char)",
          text: "Done-for-you growth for local businesses — plumbing, HVAC, dental, vet, med spa, groomers, salons. We answer after-hours calls, follow up with leads, and ask for Google reviews. From $49/mo. No dashboards. No retainers.",
          charLimit: 255,
        },
        about: {
          label: "About",
          text: "GetMeFound runs the rest for you. Four services from $49/month, built for local-business owners who'd rather work in the truck than learn another piece of software. Founded by Mike Egidio.",
        },
      },
      {
        letter: "B",
        angle: "Pain-named / loss-aversion",
        bannerOverlay: `One missed call = one lost customer.
We fix that.`,
        bioOrShortDescription: {
          label: "Short description (255 char)",
          text: "Every missed call is a customer your competitor just won. GetMeFound answers the phone, texts leads back, and rebuilds your Google reviews — done-for-you from $49/mo. Built for plumbers, HVAC, dentists, vets, salons, and groomers.",
          charLimit: 255,
        },
        about: {
          label: "About",
          text: "We're the team that picks up when you can't. Six done-for-you growth services for local businesses, starting at $49/month. Set up by us. Run by us. You just keep doing the work.",
        },
      },
      {
        letter: "C",
        angle: "Conversational / Mike-voice",
        bannerOverlay: `Hi, I'm Mike.
I built the system
your competitor wishes they had.`,
        bioOrShortDescription: {
          label: "Short description (255 char)",
          text: "I'm Mike. I run GetMeFound. We do the work for local-business owners who don't have time to learn another app. After-hours phone, review chasing, lead follow-up — done-for-you from $49/mo.",
          charLimit: 255,
        },
        about: {
          label: "About",
          text: "Founder-run. Three-person team. No call centers, no offshore support, no $4,900 retainer. Just six done-for-you growth services that actually work for plumbing, HVAC, dental, vet, med spa, groomer, and salon owners.",
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: 'Lifestyle scene, "after hours"',
        model: "Imagen 4",
        prompt: `Documentary photograph of a residential street at dusk, one porch light glowing warm yellow, an HVAC service van parked in a driveway with its rear doors closed, the operator silhouetted faintly inside the cab on a phone call. Deep navy sky, cream-and-yellow porch glow, soft forest-green hedges in foreground. No logos visible. Shot wide, 35mm, cinematic ambient light.`,
        whyItWorks:
          "Tells the after-hours-call story in a single frame, with a local-operator-coded vehicle and no AI tropes.",
      },
      {
        number: 2,
        lane: "Bold typographic block",
        model: "Recraft v3",
        prompt: `Facebook cover banner, navy field (#0A1628) on the left two-thirds, cream block (#F8F6F1) on the right third with thin forest-green rule dividing them. Large cream serif headline left side, small forest-green sans-serif tag right side. Print-poster restraint, no illustration, paper texture. Hard geometric grid.`,
        whyItWorks: "Distinct from every gradient-blob AI page on Facebook. Reads like a Monocle ad.",
      },
      {
        number: 3,
        lane: 'Still-life, "the tools and the phone"',
        model: "FLUX Pro 1.1 Ultra",
        prompt: `Overhead flat-lay on weathered cream butcher paper: a pipe wrench, a pair of pruning shears, a dental mirror, a salon comb, and a smartphone arranged in a loose semicircle. Soft north-facing window light, deep shadows, no branding on any object. Forest-green linen napkin in one corner. Editorial food-photography composition style applied to trade tools. Shot on Phase One, 80mm.`,
        whyItWorks:
          '"We serve all these trades" without a wall of industry icons. Premium magazine aesthetic.',
      },
    ],
  },

  {
    key: "x",
    label: "X / Twitter",
    dimensions: "1500 × 500",
    textOptions: [
      {
        letter: "A",
        angle: "Punchy / single-line declaration",
        bannerOverlay: `We do the work.
You keep the customer.`,
        bioOrShortDescription: {
          label: "Bio (160 char)",
          text: "Done-for-you growth for local businesses. Plumbing, HVAC, dental, vet, med spa, groomers, salons. From $49/mo. Founder @mikeegidio.",
          charLimit: 160,
        },
      },
      {
        letter: "B",
        angle: "Outcome-stack",
        bannerOverlay: `Answered calls.
Faster follow-up.
More 5-star reviews.`,
        bioOrShortDescription: {
          label: "Bio (160 char)",
          text: "We run the rest for local-business owners. After-hours phone, lead follow-up, Google reviews. From $49/mo. No dashboards. No retainers.",
          charLimit: 160,
        },
      },
      {
        letter: "C",
        angle: "Contrarian / positioning",
        bannerOverlay: `Your marketing agency
won't sell you this.
We will. $49/mo.`,
        bioOrShortDescription: {
          label: "Bio (160 char)",
          text: "The growth automation your marketing agency won't sell you — because we charge $49, not $4,900. Done-for-you for local businesses. Run by @mikeegidio.",
          charLimit: 160,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Wide cinematic still-life",
        model: "FLUX Pro 1.1 Ultra",
        prompt: `Ultra-wide 3:1 cinematic still-life: a long cream-paper workshop bench stretching the full frame, scattered with a worn leather notebook, a brass desk bell, a coiled forest-green phone cord, a single ringing landline at far right. Raking afternoon light from camera-left, deep navy shadows, anamorphic lens flare. No text, no people, no modern screens.`,
        whyItWorks:
          'X header is a horizontal canvas; only a wide cinematic frame uses it. Bell + phone cord = "we pick up".',
      },
      {
        number: 2,
        lane: "Typographic banner with mark",
        model: "Recraft v3",
        prompt: `Wide banner, deep navy (#0A1628) background, cream (#F8F6F1) wordmark "AI OUTSOURCE HUB" set in clean grotesque caps centered, a single forest-green (#2D6A4F) horizontal rule above and below. Generous negative space. Letterpress paper grain texture overlay. No imagery.`,
        whyItWorks: "Survives X's small-screen crop. Doubles as a brand-mark statement.",
      },
      {
        number: 3,
        lane: 'Abstract metaphor, "the open line"',
        model: "Imagen 4",
        prompt: `Wide cinematic photograph of a single taut forest-green phone cord stretched horizontally across a deep navy background, lit from one side so it casts a long crisp shadow on a cream wall behind it. Almost monochrome composition, three colors only, lots of empty space. Shot 35mm, sharp focus, fine art minimalism.`,
        whyItWorks: "Reads instantly even at thumbnail scale. Cord = open line = the entire product.",
      },
    ],
  },

  {
    key: "instagram",
    label: "Instagram (profile pic + bio only — no banner)",
    dimensions: "320 × 320 profile",
    textOptions: [
      {
        letter: "A",
        angle: "Plain-English benefit stack",
        bannerOverlay: "(profile pic only — no banner overlay)",
        bioOrShortDescription: {
          label: "Bio (150 char)",
          text: "Done-for-you growth for local businesses. We answer the phone, chase reviews, follow up with leads. From $49/mo. Run by Mike Egidio.",
          charLimit: 150,
        },
      },
      {
        letter: "B",
        angle: "Pain-named hook",
        bannerOverlay: "(profile pic only)",
        bioOrShortDescription: {
          label: "Bio (150 char)",
          text: "The phone rings at 9pm. We pick up. Done-for-you growth for plumbing, HVAC, dental, vet, salons, groomers. From $49/mo.",
          charLimit: 150,
        },
      },
      {
        letter: "C",
        angle: "Industry-call-out",
        bannerOverlay: "(profile pic only)",
        bioOrShortDescription: {
          label: "Bio (150 char)",
          text: "Growth for the trades. Plumbing | HVAC | Dental | Vet | Med Spa | Groomer | Salon. Done-for-you from $49/mo. No dashboards.",
          charLimit: 150,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Cream monogram on navy",
        model: "Recraft v3",
        prompt: `Square profile mark, deep navy (#0A1628) background, cream (#F8F6F1) sans-serif monogram "GMF" centered, thin forest-green (#2D6A4F) circular rule inset from the edge. Letterpress texture. No gradient, no glow.`,
        whyItWorks: "Reads at 32px. Owns the palette. Serious firm, not Canva startup.",
      },
      {
        number: 2,
        lane: 'Symbolic, "answered call" icon',
        model: "Recraft v3",
        prompt: `Square profile, cream (#F8F6F1) background, single forest-green (#2D6A4F) line-art icon of a vintage rotary phone handset off its cradle, centered, generous margins, light paper-grain texture. No text. Print-poster simplicity.`,
        whyItWorks: "Distinctive icon people recognize across grid feeds.",
      },
      {
        number: 3,
        lane: "Founder portrait crop",
        model: "Imagen 4",
        prompt: `Square portrait crop of a 50-something American founder in a cream button-down against a deep navy textured wall, three-quarter face, warm window light from camera-left, calm direct eye contact, no smile-forced expression, editorial portrait style. Tight head-and-shoulders crop, square 1:1.`,
        whyItWorks: "Founder-led brand = founder face. IG rewards human profile pics for connection.",
      },
    ],
  },

  {
    key: "gbp",
    label: "Google Business Profile",
    dimensions: "Cover ~1408 × 768",
    textOptions: [
      {
        letter: "A",
        angle: "Service-stack / SEO-aware",
        bannerOverlay: `Done-for-you growth
for local businesses
from $49/mo`,
        about: {
          label: "Description (750 char)",
          text: `GetMeFound is done-for-you growth for local-business owners. We answer after-hours phone calls so you never lose a customer to voicemail. We ask every happy customer for a Google review. We follow up with quotes that went cold. We rebuild your online profile. Four services. From $49/month. No dashboards to log into. No agency retainer. No 40-hour onboarding. Built for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners. Founded by Mike Egidio. Three-person US-based team. Month-to-month. Cancel anytime.`,
        },
        categories:
          "Marketing Agency (primary), Business Management Consultant, Software Company, Telephone Answering Service",
      },
      {
        letter: "B",
        angle: "Local-owner empathy / direct",
        bannerOverlay: `Built for owners who'd rather
be in the truck than the dashboard.`,
        about: {
          label: "Description (750 char)",
          text: `You didn't start your business to spend nights doing marketing. We did. GetMeFound runs the rest for local-business owners — answering the phone after hours, chasing leads, asking for Google reviews — so you can stay in the truck, the chair, or the operatory where the money actually gets made. Six done-for-you services from $49 a month. No software you'll never log into. No retainer. We set it up. We run it. You see the results in your inbox. Built for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners. Founded by Mike Egidio. US-based. Month-to-month.`,
        },
        categories:
          "Marketing Agency (primary), Business Management Consultant, Software Company",
      },
      {
        letter: "C",
        angle: "Outcome-first / numbers-led",
        bannerOverlay: `Stop losing money
to missed calls
and missed reviews.`,
        about: {
          label: "Description (750 char)",
          text: `The average local-service business misses 27% of inbound calls and 80% of opportunities to ask for a Google review. We fix both. GetMeFound provides six done-for-you growth services for local businesses — phone answering for after-hours calls, instant text-back for web leads, automated review requests, intercept-and-resolve for unhappy customers, lead follow-up sequences, and social posting. From $49 per month. No dashboards. No retainers. No long contracts. We set it up. We run it. We send you the results. Built specifically for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners. Founded by Mike Egidio. US-based three-person team.`,
        },
        categories:
          "Marketing Agency (primary), Business Management Consultant, Telephone Answering Service, Software Company",
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Team documentary photo",
        model: "Imagen 4",
        prompt: `Documentary group photo of a three-person US small business team standing casually in front of a cream-painted brick wall, founder in center (50s, cream button-down), business development lead to one side (40s, navy sweater), sales manager to the other (50s, warm smile, cream blouse). Natural overcast daylight, no studio lighting, slight depth of field, photographed at 50mm. Real-people warmth, not stock-photo grin.`,
        whyItWorks: "GBP rewards human team photos for trust. Local owners hire people, not logos.",
      },
      {
        number: 2,
        lane: "Workshop / studio still-life",
        model: "FLUX Pro 1.1 Ultra",
        prompt: `Wide editorial still-life of a clean cream-papered desk: a brass desk bell, a leather-bound notebook open to a handwritten list, a vintage rotary phone in forest green, a coffee mug, a small framed handwritten thank-you note. Soft directional window light from camera-right, deep navy wall behind. Shot 4:3, Phase One, 80mm, shallow depth.`,
        whyItWorks: '"This is a real business with a real office" — exactly what GBP scores.',
      },
      {
        number: 3,
        lane: "Brand panel / typographic",
        model: "Recraft v3",
        prompt: `Wide cover image, navy (#0A1628) field with cream (#F8F6F1) panel inset right two-thirds, cream serif headline "Done-for-you growth for local businesses" set inside the panel, small forest-green (#2D6A4F) wordmark beneath. Paper-grain texture. Letterpress restraint, no imagery.`,
        whyItWorks: "Survives every GBP crop because text holds the center.",
      },
    ],
  },

  {
    key: "mike",
    label: "Mike Egidio — Personal LinkedIn",
    dimensions: "1584 × 396",
    notes:
      "Image option MUST match Kip + Teri (same number across all 3 personal banners — visual team coherence).",
    textOptions: [
      {
        letter: "A",
        angle: "Founder-builder voice",
        bannerOverlay: `I build the system
your competitor wishes
they had.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Founder, GetMeFound | Done-for-you growth for local businesses from $49/mo | We answer the phone, chase reviews, follow up with leads — so you don't have to | Building the system your marketing agency won't sell you",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `I spent years watching great local-business owners lose to weaker competitors who simply replied faster. Now I sell the follow-up. GetMeFound is six done-for-you growth services built for plumbing, HVAC, lawn care, dental, vet, med spa, pet groomer, and salon owners. From $49 a month. No dashboards. No retainer. We set it up and we run it. If you'd rather be in the truck than in a marketing dashboard, talk to me.`,
        },
      },
      {
        letter: "B",
        angle: "Why-statement / mission-led",
        bannerOverlay: `Local businesses shouldn't lose
to faster competitors.
I'm here to fix that.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Founder @ GetMeFound | Helping plumbers, HVAC techs, dentists, vets, med spas, groomers & salon owners stop losing customers to faster competitors | Done-for-you growth from $49/mo",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `Every week I talk to a local-business owner who's losing money in plain sight — missed calls, ghosted leads, a Google profile that hasn't seen a new review in eight months. The fix isn't another piece of marketing software they won't log into. The fix is done-for-you. That's what we built. GetMeFound runs the rest for you — four services from $49/month, no retainer, no contract. I'm here to make sure the best operator on the block also wins the customer.`,
        },
      },
      {
        letter: "C",
        angle: "Plain-English / no-jargon",
        bannerOverlay: `I run a small company
that runs growth
for other small companies.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Run GetMeFound | We do the work for local businesses so they don't have to | Plumbing, HVAC, dental, vet, salons, groomers, med spas | From $49/mo, US-based, month-to-month",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `I'll keep this plain. GetMeFound is a three-person US-based company that runs growth for local-business owners. We answer your phone after hours. We text your web leads back inside a minute. We ask your happy customers for Google reviews. We follow up with quotes that went cold. From $49 a month. No software for you to learn. No agency retainer. No 12-month contract. I started this because my friends in the trades kept asking me to fix the same problems. Now we fix them for a living.`,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Environmental portrait, founder at desk (shared team lane)",
        model: "Imagen 4",
        prompt: `Documentary 4:1 environmental portrait, 50-something American founder in cream button-down shirt, seated at a cream-paper-topped wooden desk in a calm navy-walled office, three-quarter turned toward camera-left, hand resting on an open leather notebook, a forest-green rotary phone on the desk, soft warm directional window light from camera-left, anamorphic crop, deep navy shadow on the right two-thirds reserved for overlay text. Editorial documentary style, not stock-photo grin.`,
        whyItWorks: "Anchors the team lane. Same office Kip/Teri will sit in.",
      },
      {
        number: 2,
        lane: "Cinematic detail of founder's hands (shared team lane variant)",
        model: "FLUX Pro 1.1 Ultra",
        prompt: `4:1 cinematic close-up shot inside the same cream-and-navy office, founder's hands (50s, weathered, no jewelry) holding a fountain pen over a handwritten list on cream paper, a forest-green rotary phone in soft focus on the right, warm raking window light from left, anamorphic lens, film grain. Face not visible — implied presence. Right side reserved for text overlay.`,
        whyItWorks: '"The founder who does the work" without a face. Same office as Options 1 + 3.',
      },
      {
        number: 3,
        lane: "Brand-panel + small portrait inset (shared team lane variant)",
        model: "Recraft v3",
        prompt: `4:1 banner, navy field (#0A1628) on left two-thirds with cream serif headline space, small cream rectangular inset on the right with a tight portrait of a 50-something founder in a cream button-down photographed against the same navy office wall, thin forest-green (#2D6A4F) rule separating panels. Letterpress paper grain. Magazine-cover restraint.`,
        whyItWorks: "Portrait inset stays consistent across Mike/Kip/Teri — three banners = one masthead.",
      },
    ],
  },

  {
    key: "kip",
    label: "Kip Leathers — Personal LinkedIn (BD)",
    dimensions: "1584 × 396",
    notes: "Image option MUST match Mike + Teri (same number for team coherence).",
    textOptions: [
      {
        letter: "A",
        angle: "Door-opener / direct",
        bannerOverlay: `The first call you'll get
from GetMeFound
is from me.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Business Development @ GetMeFound | I open the door for local-business owners who want done-for-you growth without the agency BS | Plumbing, HVAC, dental, vet, salons, groomers",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `My job is simple: I find local-business owners who are losing money to missed calls and slow follow-up, and I show them what done-for-you growth looks like when it actually works. No 90-minute demo. No 12-month contract. No dashboard you'll never log into. GetMeFound starts at $49/month and we set it up for you. If you run a plumbing, HVAC, dental, vet, med spa, groomer, or salon business and you're tired of marketing software you don't have time to use — let's talk.`,
        },
      },
      {
        letter: "B",
        angle: "Trust-builder / relationship voice",
        bannerOverlay: `I talk to local owners every day.
Most are losing money
they don't know they're losing.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Business Development, GetMeFound | Helping local-business owners see the money they're losing in plain sight — and fix it without hiring a marketing agency | Done-for-you growth from $49/mo",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `Most local-business owners I talk to are losing more money to missed calls and unfollowed-up leads than to any marketing problem they're trying to solve. They just can't see it from inside the business. My job is to show them the leak — and then plug it with done-for-you growth from GetMeFound. From $49/month. We set it up. We run it. You stay in the work. If you'd rather have a real conversation than sit through a sales deck, message me.`,
        },
      },
      {
        letter: "C",
        angle: "Anti-sales-pitch positioning",
        bannerOverlay: `I don't do demos.
I show you the leak.
Then I fix it.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "BD @ GetMeFound | No demos. No decks. I show local-business owners what they're losing to missed calls & weak follow-up — then we fix it. Done-for-you growth from $49/mo.",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `I've sat through enough SaaS demos to last a lifetime. So I don't do them. When I talk to a local-business owner, I walk through their phone log, their Google reviews, and their lead-response time. Nine times out of ten I find them losing money in places they didn't know to look. Then GetMeFound fixes it — done-for-you, from $49/month. If that's a conversation you want to have, message me.`,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Environmental portrait, BD at desk (shared team lane)",
        model: "Imagen 4",
        prompt: `Documentary 4:1 environmental portrait, 40-something American man in a navy crewneck sweater over a cream collared shirt, seated at the same cream-paper-topped desk in the same navy-walled office as the founder banner, leaning slightly forward toward camera-left, headset resting on the desk beside an open notebook, a forest-green rotary phone in mid-ground, warm directional window light from camera-left, anamorphic crop, deep navy shadow on right two-thirds reserved for overlay text.`,
        whyItWorks:
          "Same office + light as Mike. Headset signals BD/conversations without screaming salesperson.",
      },
      {
        number: 2,
        lane: "Cinematic detail of BD's hands (shared team lane variant)",
        model: "FLUX Pro 1.1 Ultra",
        prompt: `4:1 cinematic close-up inside the same cream-and-navy office, 40-something man's hands resting on a leather portfolio open to a handwritten call list, a forest-green rotary phone handset lifted to his ear (face out of frame), warm raking window light from camera-left, anamorphic lens, film grain. Right side reserved for text overlay.`,
        whyItWorks: '"The person picking up the phone" — Kip\'s job in one frame.',
      },
      {
        number: 3,
        lane: "Brand-panel + portrait inset (shared team lane variant)",
        model: "Recraft v3",
        prompt: `4:1 banner, navy (#0A1628) field on left two-thirds for cream serif headline, small cream rectangular inset on the right with tight portrait of a 40-something man in navy crewneck against the same navy office wall as the founder banner, thin forest-green (#2D6A4F) rule separating panels. Letterpress paper grain. Magazine masthead restraint.`,
        whyItWorks: "Locks into 3-banner masthead system with Mike & Teri.",
      },
    ],
  },

  {
    key: "teri",
    label: "Teri Egidio — Personal LinkedIn (Sales / Onboarding)",
    dimensions: "1584 × 396",
    notes: "Image option MUST match Mike + Kip (same number for team coherence).",
    textOptions: [
      {
        letter: "A",
        angle: "Onboarding-led / hand-off voice",
        bannerOverlay: `Kip opens the door.
I make sure you stay.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Sales Manager & Onboarding @ GetMeFound | I get new clients set up fast and make sure the AI actually does what we said it would | Done-for-you growth for local businesses from $49/mo",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `I run sales and onboarding at GetMeFound, which really means I do two things: I make sure every new client gets set up in days not months, and I make sure what we sold is what gets delivered. Local-business owners don't have time to chase an agency for an update — so I don't make them. From the moment you say yes to the day your AI is answering your phone, I'm the one you talk to. Six done-for-you services, from $49/month. If you run a local business and you need this to just work, that's my job.`,
        },
      },
      {
        letter: "B",
        angle: "Reassurance / no-friction promise",
        bannerOverlay: `No 40-hour onboarding.
No chasing us for updates.
Just done.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Sales & Onboarding @ GetMeFound | The fastest, friendliest onboarding in done-for-you growth for local businesses | From signup to your AI answering the phone — usually under a week",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `Most "AI for small business" companies hand you a 40-page onboarding doc and disappear. I'm the opposite. When you sign with GetMeFound, I take it from there — gathering what we need, setting up your services, and getting your AI live, usually inside a week. You won't chase me. I'll already have messaged you. Six done-for-you services from $49/month, built for plumbing, HVAC, dental, vet, med spa, groomer, and salon owners. If you want this to be the easiest tech decision you've made in a year, I'm here.`,
        },
      },
      {
        letter: "C",
        angle: "Personal / family-business honest",
        bannerOverlay: `I sell it.
I set it up.
I answer when you call.`,
        taglineOrHeadline: {
          label: "Headline (220 char)",
          text: "Sales Manager & Onboarding, GetMeFound | Family-run, three-person team, US-based | Done-for-you growth for local businesses from $49/mo | I'm the one who picks up after you sign",
          charLimit: 220,
        },
        about: {
          label: "About",
          text: `GetMeFound is a three-person US-based company. My husband Mike founded it. Kip handles new conversations. I handle sales close and onboarding — which means once you sign, you talk to me, not a ticket queue. I'll get your services live fast, and if anything's off, I'll know before you do. Six done-for-you growth services from $49/month for plumbing, HVAC, dental, vet, med spa, groomer, and salon owners. Small company on purpose.`,
        },
      },
    ],
    imageOptions: [
      {
        number: 1,
        lane: "Environmental portrait, onboarding-at-desk (shared team lane)",
        model: "Imagen 4",
        prompt: `Documentary 4:1 environmental portrait, 50-something American woman in a cream linen blouse, seated at the same cream-paper-topped desk in the same navy-walled office as the founder and BD banners, three-quarter turned to camera-left, a clipboard with a printed onboarding checklist in hand, a forest-green rotary phone on the desk, warm cup of coffee, soft directional window light from camera-left, anamorphic crop, deep navy shadow on right two-thirds reserved for overlay text.`,
        whyItWorks: "Same office + light + desk as Mike and Kip — three banners read as one masthead.",
      },
      {
        number: 2,
        lane: "Cinematic detail of Teri's hands (shared team lane variant)",
        model: "FLUX Pro 1.1 Ultra",
        prompt: `4:1 cinematic close-up inside the same cream-and-navy office, 50-something woman's hands (warm, no statement jewelry) checking items off a printed onboarding list on cream paper with a fountain pen, a forest-green rotary phone in soft focus on the right, warm raking window light from camera-left, anamorphic lens, film grain. Face out of frame. Right side reserved for text overlay.`,
        whyItWorks: '"The person making sure it actually gets done" — Teri\'s job in one frame.',
      },
      {
        number: 3,
        lane: "Brand-panel + portrait inset (shared team lane variant)",
        model: "Recraft v3",
        prompt: `4:1 banner, navy (#0A1628) field on left two-thirds for cream serif headline, small cream rectangular inset on the right with tight portrait of a 50-something woman in cream linen blouse against the same navy office wall, thin forest-green (#2D6A4F) rule separating panels. Letterpress paper grain. Magazine masthead restraint.`,
        whyItWorks: "Completes the 3-banner masthead system with Mike & Kip.",
      },
    ],
  },
];
