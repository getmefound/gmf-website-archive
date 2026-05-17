const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "http://2.24.198.207:56006";

export async function GET() {
  try {
    // Server-side login POST (avoids mixed-content HTTPS→HTTP issue)
    const res = await fetch(`${OPENCLAW_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(OPENCLAW_TOKEN)}`,
      redirect: "manual",
    });

    // Extract cookie from OpenClaw response
    const setCookie = res.headers.get("set-cookie");

    // Return page that redirects to OpenClaw with JS (no mixed content)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Opening OpenClaw...</title>
</head>
<body>
  <script>
    window.location.replace("${OPENCLAW_BASE}/");
  </script>
</body>
</html>
    `;

    const response = new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

    // Forward cookie so session works after redirect
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
}
