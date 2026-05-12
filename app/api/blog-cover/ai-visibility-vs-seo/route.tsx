import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1600, height: 900 } as const;

const googleResults = [
  { rank: 1, name: "Acme Plumbing — Hartford CT", url: "acmeplumbing.com" },
  { rank: 2, name: "Bob's Plumbing & Heating", url: "bobsplumbingct.com" },
  { rank: 3, name: "Hartford Plumbing Pros", url: "hartfordpros.com" },
  { rank: 4, name: "Quick Fix Plumbers", url: "quickfixhartford.com" },
  { rank: 5, name: "City-Wide Plumbing Co.", url: "citywideplumbing.com" },
  { rank: 6, name: "ABC Plumbing Services", url: "abcplumbingllc.com" },
];

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(135deg, #0A1628 0%, #142a44 100%)",
          color: "#F8F6F1",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        {/* ============ LEFT: Google search ============ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#A8B3C4",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Traditional SEO
          </div>

          {/* Phone frame */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 420,
              height: 640,
              background: "#ffffff",
              borderRadius: 36,
              border: "8px solid #0f1c2e",
              padding: 24,
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Google wordmark */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </div>

            {/* Search bar */}
            <div
              style={{
                display: "flex",
                background: "#f1f3f4",
                borderRadius: 999,
                padding: "10px 18px",
                fontSize: 16,
                color: "#5f6368",
                marginBottom: 18,
              }}
            >
              best plumber in hartford
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 12,
                color: "#70757a",
                marginBottom: 12,
              }}
            >
              About 1,240,000 results
            </div>

            {/* Results */}
            {googleResults.map((r) => (
              <div
                key={r.rank}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    color: "#5f6368",
                  }}
                >
                  {r.url}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: r.rank === 1 ? "#1a0dab" : "#1a73e8",
                    fontWeight: r.rank === 1 ? 700 : 500,
                  }}
                >
                  {r.name}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              color: "#A8B3C4",
              fontSize: 19,
              marginTop: 22,
              textAlign: "center",
              maxWidth: 420,
            }}
          >
            Position #1 captures ~30% of clicks
          </div>
        </div>

        {/* ============ VS pill ============ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 60,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90,
              borderRadius: 999,
              background: "#3D7A65",
              color: "#ffffff",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -1,
              boxShadow: "0 10px 30px rgba(61,122,101,0.5)",
            }}
          >
            VS
          </div>
        </div>

        {/* ============ RIGHT: ChatGPT recommendation ============ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#7CE7B7",
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            AI Visibility
          </div>

          {/* Phone frame */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 420,
              height: 640,
              background: "#212121",
              borderRadius: 36,
              border: "8px solid #0f1c2e",
              padding: 24,
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
              color: "#ECECEC",
            }}
          >
            {/* ChatGPT header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#10A37F",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 800,
                  marginRight: 12,
                }}
              >
                ⌬
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#ECECEC",
                }}
              >
                ChatGPT
              </div>
            </div>

            {/* User question bubble */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: "#2f2f2f",
                  borderRadius: 22,
                  padding: "12px 16px",
                  fontSize: 16,
                  maxWidth: 300,
                  color: "#ECECEC",
                }}
              >
                Who&apos;s a good plumber in Hartford?
              </div>
            </div>

            {/* AI answer */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 17,
                lineHeight: 1.5,
                color: "#ECECEC",
              }}
            >
              <div style={{ display: "flex", marginBottom: 8 }}>I&apos;d recommend</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(16,163,127,0.18)",
                  border: "1px solid rgba(16,163,127,0.5)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#7CE7B7",
                  marginBottom: 10,
                }}
              >
                Acme Plumbing
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: 6,
                  color: "#C6C6C6",
                }}
              >
                4.8 stars · 142 reviews · 24/7 emergency.
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#C6C6C6",
                }}
              >
                They&apos;re highly rated for after-hours calls and consistently get good marks for fair pricing.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#7CE7B7",
              fontSize: 19,
              marginTop: 22,
              textAlign: "center",
              maxWidth: 420,
              fontWeight: 600,
            }}
          >
            Recommendation captures the customer
          </div>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
