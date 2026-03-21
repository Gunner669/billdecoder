import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function aggregate(records) {
  var total = records.length;
  var byState = {};
  var verdicts = { overcharged: 0, fair: 0, competitive: 0 };
  var tariffs = {};
  var retailers = {};
  var allCosts = [];
  var allOverpay = [];
  var lastUpdated = null;

  records.forEach(function(r) {
    if (r.submittedAt && (!lastUpdated || r.submittedAt > lastUpdated)) lastUpdated = r.submittedAt;

    if (r.state) {
      if (!byState[r.state]) byState[r.state] = { count: 0, costs: [], overpays: [], verdicts: { overcharged: 0, fair: 0, competitive: 0 } };
      byState[r.state].count++;
      if (typeof r.userAnnualCost === "number" && r.userAnnualCost > 0) {
        byState[r.state].costs.push(r.userAnnualCost);
        allCosts.push(r.userAnnualCost);
      }
      if (typeof r.userAnnualCost === "number" && typeof r.bestDealAnnualCost === "number" && r.userAnnualCost > r.bestDealAnnualCost) {
        var overpay = r.userAnnualCost - r.bestDealAnnualCost;
        byState[r.state].overpays.push(overpay);
        allOverpay.push(overpay);
      }
      if (r.verdict && byState[r.state].verdicts[r.verdict] !== undefined) byState[r.state].verdicts[r.verdict]++;
    }

    if (r.verdict && verdicts[r.verdict] !== undefined) verdicts[r.verdict]++;
    if (r.tariffType) tariffs[r.tariffType] = (tariffs[r.tariffType] || 0) + 1;
    if (r.retailer) retailers[r.retailer] = (retailers[r.retailer] || 0) + 1;
  });

  function avg(arr) { return arr.length ? Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length) : 0; }

  var stateStats = {};
  Object.keys(byState).forEach(function(s) {
    stateStats[s] = {
      count: byState[s].count,
      avgAnnualCost: avg(byState[s].costs),
      avgOverpayment: avg(byState[s].overpays),
      verdicts: byState[s].verdicts
    };
  });

  var topRetailers = Object.keys(retailers).map(function(name) {
    return { name: name, count: retailers[name] };
  }).sort(function(a, b) { return b.count - a.count; }).slice(0, 10);

  var tariffBreakdown = Object.keys(tariffs).map(function(name) {
    return { name: name, count: tariffs[name] };
  }).sort(function(a, b) { return b.count - a.count; });

  return {
    totalSubmissions: total,
    lastUpdated: lastUpdated,
    overallAvgAnnualCost: avg(allCosts),
    overallAvgOverpayment: avg(allOverpay),
    verdictBreakdown: verdicts,
    byState: stateStats,
    tariffBreakdown: tariffBreakdown,
    topRetailers: topRetailers
  };
}

export async function GET() {
  try {
    var raw = await kv.lrange("bill_submissions", 0, -1);
    var records = raw.map(function(item) {
      return typeof item === "string" ? JSON.parse(item) : item;
    });
    var stats = aggregate(records);
    return Response.json(stats, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
    });
  } catch(err) {
    console.error("Index stats error:", err.message);
    return Response.json({ error: "Could not load stats." }, { status: 500 });
  }
}
