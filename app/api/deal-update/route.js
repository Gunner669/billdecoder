import { kv } from "@vercel/kv";

export const runtime = "nodejs";

var VALID_STATES = ["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"];

export async function POST(request) {
  var secret = process.env.ADMIN_SECRET;
  var auth = request.headers.get("authorization");
  if (!secret || auth !== "Bearer " + secret) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  var body;
  try { body = await request.json(); }
  catch(e) { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  var state = body.state;
  if (!state || !VALID_STATES.includes(state)) {
    return Response.json({ error: "Invalid state." }, { status: 400 });
  }

  if (typeof body.bestDealAnnualCost !== "number" || body.bestDealAnnualCost <= 0) {
    return Response.json({ error: "Invalid bestDealAnnualCost." }, { status: 400 });
  }

  var record = {
    bestDealAnnualCost: body.bestDealAnnualCost,
    note: typeof body.note === "string" ? body.note : "",
    updatedAt: new Date().toISOString()
  };

  try {
    await kv.set("deal_updates:" + state, JSON.stringify(record));
    return Response.json({ ok: true, state: state, record: record });
  } catch(err) {
    console.error("KV error:", err.message);
    return Response.json({ error: "Storage error." }, { status: 500 });
  }
}
