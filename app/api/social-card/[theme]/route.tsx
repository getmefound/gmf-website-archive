import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1080, height: 1080 } as const;

type Theme = {
  eyebrow: string;
  stat: string;
  unit?: string;
  tagline: string;
  accent: "green" | "amber" | "red" | "blue";
};

const THEMES: Record<string, Theme> = {
  "star-sweet-spot": {
    eyebrow: "REVIEWS",
    stat: "4.6 > 5.0",
    tagline: "Customers don't trust a perfect rating. The sweet spot is 4.6–4.8.",
    accent: "amber",
  },
  "cost-of-dormant-profile": {
    eyebrow: "THE COST OF DOING NOTHING",
    stat: "$38,400",
    unit: "/ year",
    tagline: "What a dormant Google profile costs a local business while a competitor stays disciplined.",
    accent: "red",
  },
  "review-velocity-90-day": {
    eyebrow: "THE 90-DAY RULE",
    stat: "60 > 200",
    tagline: "60 new reviews from the last 90 days outranks 200 old ones. Google weights freshness.",
    accent: "green",
  },
  "ai-recommendation-vs-rank": {
    eyebrow: "AI VISIBILITY",
    stat: "1 of 3",
    tagline: "ChatGPT names 1 of 3 businesses. Google lists 10 links. Different game, different math.",
    accent: "blue",
  },
  "diy-vs-dfy": {
    eyebrow: "DIY vs DONE-FOR-YOU",
    stat: "$5 vs $15",
    unit: "per review",
    tagline: "Cheap software looks cheaper until you count your time. Done-for-you actually runs.",
    accent: "amber",
  },
  "after-hours-payback": {
    eyebrow: "AI RECEPTIONIST",
    stat: "30 days",
    unit: "to break even",
    tagline: "Catch one extra job a month and Relay pays for itself. Most local businesses miss 9 in 10 after-hours calls.",
    accent: "green",
  },
  "ai-search-share": {
    eyebrow: "WHERE BUYERS ARE LANDING",
    stat: "1 in 4",
    unit: "local searches",
    tagline: "About a quarter of local searches have moved to AI. Most local businesses are invisible there.",
    accent: "blue",
  },
  "software-vs-work": {
    eyebrow: "DONE-FOR-YOU",
    stat: "0",
    unit: "dashboards",
    tagline: "You didn't get into your business to manage marketing software. We run the work, not the tool.",
    accent: "amber",
  },
  "reviews-compound": {
    eyebrow: "REVIEWS COMPOUND",
    stat: "10+ years",
    tagline: "Ads stop the moment you stop paying. A review you collect today still ranks for you in 2036.",
    accent: "green",
  },
  "med-spa-math": {
    eyebrow: "MED SPA MATH",
    stat: "1 review = 4 bookings",
    tagline: "One missed review compounds: stale profile, lower rank, lost trust, no new patient. Four lost.",
    accent: "amber",
  },
  "groomer-trust": {
    eyebrow: "PET GROOMERS",
    stat: "Under 20",
    unit: "reviews = no booking",
    tagline: "Pet parents don't book under 20 reviews. After that, what the reviews SAY matters most.",
    accent: "blue",
  },
};

const ACCENT: Record<Theme["accent"], { hex: string; soft: string }> = {
  green: { hex: "#7CE7B7", soft: "rgba(124,231,183,0.16)" },
  amber: { hex: "#FFC857", soft: "rgba(255,200,87,0.16)" },
  red: { hex: "#FF8A80", soft: "rgba(255,138,128,0.16)" },
  blue: { hex: "#8AB6FF", soft: "rgba(138,182,255,0.16)" },
};

export function generateStaticParams() {
  return Object.keys(THEMES).map((theme) => ({ theme }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const t = THEMES[theme];

  if (!t) {
    return new Response("Theme not found", { status: 404 });
  }

  const color = ACCENT[t.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0A1628 0%, #142a44 100%)",
          color: "#F8F6F1",
          padding: 72,
          fontFamily: "sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Top — wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2D6A4F",
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 800,
              marginRight: 16,
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "#F8F6F1",
            }}
          >
            AI OUTSOURCE HUB
          </div>
        </div>

        {/* Middle — stat + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: color.hex,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 28,
              background: color.soft,
              border: `1px solid ${color.hex}`,
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            {t.eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 156,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -4,
                color: color.hex,
              }}
            >
              {t.stat}
            </div>
            {t.unit && (
              <div
                style={{
                  display: "flex",
                  fontSize: 42,
                  fontWeight: 600,
                  color: "#A8B3C4",
                  marginLeft: 18,
                  letterSpacing: -0.5,
                }}
              >
                {t.unit}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 500,
              lineHeight: 1.25,
              color: "#F8F6F1",
              maxWidth: 920,
              letterSpacing: -0.5,
            }}
          >
            {t.tagline}
          </div>
        </div>

        {/* Bottom — url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#A8B3C4",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            getmefound.ai
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: color.hex,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Run the AI →
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
