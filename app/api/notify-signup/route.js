import { kv } from "@vercel/kv";

export const runtime = "nodejs";

var VALID_STATES = ["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"];
var VALID_VERDICTS = ["overcharged","fair","competitive"];

function isValidEmail(str) {
  if (typeof str !== "string") return false;
  var trimmed = str.trim().toLowerCase();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export async function POST(request) {
  var body;
  try { body = await request.json(); }
  catch(e) { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  var email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) return Response.json({ error: "Invalid email." }, { status: 400 });

  var state = body.state;
  if (!state || !VALID_STATES.includes(state)) return Response.json({ error: "Invalid data." }, { status: 400 });

  var verdict = body.verdict;
  if (verdict && !VALID_VERDICTS.includes(verdict)) verdict = "";

  var record = {
    email: email,
    state: state,
    userAnnualCost: typeof body.userAnnualCost === "number" ? body.userAnnualCost : null,
    bestDealAnnualCost: typeof body.bestDealAnnualCost === "number" ? body.bestDealAnnualCost : null,
    tariffType: typeof body.tariffType === "string" ? body.tariffType : "",
    verdict: verdict || "",
    subscribedAt: new Date().toISOString()
  };

  try {
    await kv.set("notify:" + email, JSON.stringify(record));
    await kv.sadd("notify_emails", email);
    return Response.json({ ok: true });
  } catch(err) {
    console.error("KV error:", err.message);
    return Response.json({ error: "Storage error." }, { status: 500 });
  }
}
