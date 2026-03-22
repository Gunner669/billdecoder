import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

function extractJSON(raw) {
  var text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  var start = text.indexOf("{");
  var end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("Could not parse response.");
  try { return JSON.parse(text.slice(start, end + 1)); }
  catch(e) { throw new Error("Response format error. Please try again."); }
}

var PROMPT = "You are a direct, plain-English Australian energy consultant. Analyse this electricity bill and return ONLY valid JSON — no markdown, no explanation, just the raw JSON object.\n\n{\"retailer\":\"string\",\"location\":\"suburb and state or postcode\",\"state\":\"NSW VIC QLD SA WA TAS ACT or NT\",\"billingPeriodDays\":\"number of days this bill covers e.g. 91\",\"tariffType\":\"Flat Rate OR Time of Use OR Controlled Load OR Unknown\",\"dailySupplyCharge\":\"e.g. $1.43/day\",\"usageRateSummary\":\"e.g. 28.5c/kWh or peak 38.5c off-peak 15.2c\",\"peakOffPeakTimes\":\"peak and off-peak times if TOU else empty string\",\"totalBillAmount\":\"e.g. $487.23\",\"estimatedAnnualCost\":\"e.g. ~$1,949/year\",\"verdict\":\"overcharged OR fair OR competitive\",\"verdictMessage\":\"One blunt honest sentence.\",\"estimatedAnnualOvercharge\":\"e.g. ~$380/year or nil if competitive\",\"usageLabel\":\"Evening Peaker OR Daytime User OR Night Owl OR Steady User OR High Consumer\",\"usageInsight\":\"2-3 plain sentences about their usage pattern.\",\"supplyChargeNote\":\"Is their supply charge high average or low for their state?\",\"solarFitRate\":\"e.g. 5c/kWh or empty string\",\"solarInsight\":\"Solar FiT analysis or empty string\",\"savingsActions\":[{\"title\":\"max 6 words\",\"detail\":\"Specific advice tied to their tariff and usage with dollar savings.\",\"annualSaving\":\"e.g. ~$140/year\"}],\"recommendedRetailers\":[\"key1\",\"key2\"],\"retailerRationale\":\"1-2 sentences why these retailers suit this customer.\",\"summary\":\"2-3 sentence plain English summary.\",\"postcodeComparison\":{\"userAnnualCost\":1949,\"stateAvgAnnualCost\":2100,\"bestDealAnnualCost\":1520,\"postcode\":\"2065\",\"referenceNote\":\"short note on benchmark source e.g. AER DMO 2025-26 for Ausgrid network\"}}\n\nVERDICT: overcharged=paying >10% above best market offer OR on standing offer. fair=within 10% but $100-300/year savings available. competitive=switching saves <$100/year.\nVERDICT MESSAGE: Must be one blunt, honest sentence in plain English. No jargon. Example: \"You are paying about $400 more per year than you need to.\" or \"Your rate is competitive — switching would save you less than $80 a year.\"\nRETAILER KEYS — choose 2-3 ONLY from: amber, energy_locals, tango, powershop, red, ovo, momentum, alinta, engie, lumo\nSAVINGS ACTIONS: Provide exactly 3-4 savingsActions. Each MUST be specific to this customer's actual tariff type, usage pattern, and rates — NOT generic advice. Reference their specific rates, times, or tariff structure. Bad example: \"Switch to a cheaper plan\". Good example: \"Your off-peak rate of 15.2c/kWh is decent but your peak rate of 38.5c is high — shifting dishwasher and laundry to after 10pm could save ~$140/year.\"\nIMPORTANT — ANNUAL vs QUARTERLY: The bill may cover a quarterly period (e.g. 90 days). estimatedAnnualCost and postcodeComparison costs MUST all be ANNUAL figures (multiply quarterly by 4 if needed). The verdictMessage should reference the billing period shown on the bill but all dollar comparisons must be annualised. Do NOT compare a quarterly bill amount to an annual average.\nPOSTCODE COMPARISON: For postcodeComparison, estimate the state average annual cost for a household with similar usage on the Default Market Offer (or VDO in VIC). Estimate the best available deal for the user's distribution network area. Use the user's estimated annual cost as userAnnualCost. All costs are integers in dollars, no formatting. Use the postcode from the bill.";

export async function POST(request) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("API key present:", !!apiKey);
  if (!apiKey) return Response.json({ error: "API not configured." }, { status: 500 });

  var body;
  try { body = await request.json(); }
  catch(e) { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  var base64 = body.base64;
  var mimeType = body.mimeType;
  if (!base64 || !mimeType) return Response.json({ error: "Missing data." }, { status: 400 });

  var isPDF = mimeType === "application/pdf";
  var contentBlock = isPDF
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
    : { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } };

  var client = new Anthropic({ apiKey: apiKey });
  var response;
  try {
    response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{ role: "user", content: [contentBlock, { type: "text", text: PROMPT }] }]
    });
  } catch(err) {
    console.error("Anthropic error:", JSON.stringify(err));
    console.error("Anthropic error message:", err.message);
    console.error("Anthropic error status:", err.status);
    if (err && err.status === 429) return Response.json({ error: "Too many requests. Wait 30 seconds." }, { status: 429 });
    return Response.json({ error: "Service error: " + err.message }, { status: 500 });
  }

  if (response.stop_reason === "max_tokens") return Response.json({ error: "Try a single page image." }, { status: 422 });

  var rawText = (response.content || []).filter(function(b) { return b.type === "text"; }).map(function(b) { return b.text; }).join("");
  if (!rawText) return Response.json({ error: "No response. Please try again." }, { status: 500 });

  try {
    var analysis = extractJSON(rawText);
    return Response.json({ analysis: analysis });
  } catch(err) {
    return Response.json({ error: err.message }, { status: 422 });
  }
}
