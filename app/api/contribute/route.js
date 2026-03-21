import { kv } from "@vercel/kv";

export const runtime = "nodejs";

var VALID_STATES = ["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"];
var VALID_VERDICTS = ["overcharged","fair","competitive"];

export async function POST(request) {
  var body;
  try { body = await request.json(); }
  catch(e) { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  var state = body.state;
  var verdict = body.verdict;
  if (!state || !VALID_STATES.includes(state)) return Response.json({ error: "Invalid data." }, { status: 400 });
  if (!verdict || !VALID_VERDICTS.includes(verdict)) return Response.json({ error: "Invalid data." }, { status: 400 });

  var record = {
    state: state,
    retailer: typeof body.retailer === "string" ? body.retailer : "",
    tariffType: typeof body.tariffType === "string" ? body.tariffType : "",
    dailySupplyCharge: typeof body.dailySupplyCharge === "string" ? body.dailySupplyCharge : "",
    usageRateSummary: typeof body.usageRateSummary === "string" ? body.usageRateSummary : "",
    totalBillAmount: typeof body.totalBillAmount === "string" ? body.totalBillAmount : "",
    estimatedAnnualCost: typeof body.estimatedAnnualCost === "string" ? body.estimatedAnnualCost : "",
    verdict: verdict,
    usageLabel: typeof body.usageLabel === "string" ? body.usageLabel : "",
    solarFitRate: typeof body.solarFitRate === "string" ? body.solarFitRate : "",
    userAnnualCost: typeof body.userAnnualCost === "number" ? body.userAnnualCost : null,
    stateAvgAnnualCost: typeof body.stateAvgAnnualCost === "number" ? body.stateAvgAnnualCost : null,
    bestDealAnnualCost: typeof body.bestDealAnnualCost === "number" ? body.bestDealAnnualCost : null,
    submittedAt: new Date().toISOString()
  };

  try {
    await kv.lpush("bill_submissions", JSON.stringify(record));
    return Response.json({ ok: true });
  } catch(err) {
    console.error("KV error:", err.message);
    return Response.json({ error: "Storage error." }, { status: 500 });
  }
}
