import { NextRequest } from "next/server";
import { cleanClientSlug } from "@/lib/review-send-candidates";

const HEADERS = ["name", "email", "phone", "job_date", "notes"];
const SAMPLE_ROWS = [
  ["Jane Customer", "jane@example.com", "555-0100", "2026-05-21", "completed service"],
  ["Sam Customer", "sam@example.com", "555-0101", "2026-05-20", "happy customer"],
];

export function GET(req: NextRequest) {
  const client = cleanClientSlug(req.nextUrl.searchParams.get("client")) || "client";
  const csv = [HEADERS, ...SAMPLE_ROWS].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${client}-review-customers-template.csv"`,
      "cache-control": "no-store",
    },
  });
}

function csvEscape(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replaceAll('"', '""')}"`;
}
