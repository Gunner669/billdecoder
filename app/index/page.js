import { kv } from "@vercel/kv";

export const revalidate = 300;

export const metadata = {
  title: "BillDecoder Index — Australian Electricity Bill Insights",
  description: "Real aggregate insights from anonymised Australian electricity bills contributed by Australians.",
  openGraph: {
    title: "BillDecoder Index — Australian Electricity Bill Insights",
    description: "Average costs, overpayment rates, and tariff breakdowns from real Australian electricity bills.",
    url: "https://billdecoder.au/index"
  },
  alternates: {
    canonical: "https://billdecoder.au/index"
  }
};

function avg(arr) { return arr.length ? Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length) : 0; }
function fmtCost(n) { return "$" + Number(n).toLocaleString(); }
function pct(n, total) { return total > 0 ? Math.round((n / total) * 100) : 0; }

function computeStats(records) {
  var byState = {};
  var verdicts = { overcharged: 0, fair: 0, competitive: 0 };
  var tariffs = {};
  var retailers = {};
  var allCosts = [];
  var allOverpay = [];

  records.forEach(function(r) {
    if (r.state) {
      if (!byState[r.state]) byState[r.state] = { count: 0, costs: [], overpays: [] };
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
    }
    if (r.verdict && verdicts[r.verdict] !== undefined) verdicts[r.verdict]++;
    if (r.tariffType) tariffs[r.tariffType] = (tariffs[r.tariffType] || 0) + 1;
    if (r.retailer) retailers[r.retailer] = (retailers[r.retailer] || 0) + 1;
  });

  var stateStats = Object.keys(byState).map(function(s) {
    return { state: s, count: byState[s].count, avgCost: avg(byState[s].costs), avgOverpay: avg(byState[s].overpays) };
  }).sort(function(a, b) { return b.avgCost - a.avgCost; });

  var topRetailers = Object.keys(retailers).map(function(name) {
    return { name: name, count: retailers[name] };
  }).sort(function(a, b) { return b.count - a.count; }).slice(0, 8);

  var tariffList = Object.keys(tariffs).map(function(name) {
    return { name: name, count: tariffs[name] };
  }).sort(function(a, b) { return b.count - a.count; });

  return {
    total: records.length,
    avgCost: avg(allCosts),
    avgOverpay: avg(allOverpay),
    verdicts: verdicts,
    stateStats: stateStats,
    topRetailers: topRetailers,
    tariffList: tariffList
  };
}

export default async function IndexPage() {
  var raw = [];
  try { raw = await kv.lrange("bill_submissions", 0, -1); } catch(e) { /* empty */ }
  var records = raw.map(function(item) { return typeof item === "string" ? JSON.parse(item) : item; });
  var stats = computeStats(records);
  var total = stats.total;
  var vTotal = stats.verdicts.overcharged + stats.verdicts.fair + stats.verdicts.competitive;

  return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      <header style={{background:"#0f172a",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#10b981",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <a href="/" style={{color:"#fff",fontWeight:800,fontSize:18,textDecoration:"none"}}>BillDecoder<span style={{color:"#10b981"}}>.au</span></a>
        </div>
        <a href="/" style={{background:"none",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"6px 14px",fontSize:13,textDecoration:"none",fontWeight:600}}>Analyse your bill</a>
      </header>

      <main style={{maxWidth:760,margin:"0 auto",padding:"36px 16px 64px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <h1 style={{fontSize:"clamp(26px,5vw,36px)",fontWeight:900,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:12,color:"#0f172a"}}>
            The BillDecoder <span style={{color:"#10b981"}}>Index</span>
          </h1>
          <p style={{fontSize:16,color:"#64748b",maxWidth:480,margin:"0 auto",lineHeight:1.7}}>
            Real electricity bill data from Australians who opted in. Anonymised. Independent.
          </p>
          {total > 0 && (
            <span style={{display:"inline-block",marginTop:12,background:"#f0fdf4",color:"#15803d",padding:"5px 14px",borderRadius:20,fontSize:13,fontWeight:700}}>
              {total} bill{total !== 1 ? "s" : ""} contributed
            </span>
          )}
        </div>

        {total === 0 ? (
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:"48px 24px",textAlign:"center",maxWidth:520,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <div style={{background:"#f0fdf4",borderRadius:16,padding:16}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="#10b981"/><rect x="10" y="7" width="4" height="14" rx="1" fill="#10b981" opacity="0.7"/><rect x="17" y="3" width="4" height="18" rx="1" fill="#10b981" opacity="0.4"/></svg>
              </div>
            </div>
            <p style={{fontWeight:700,fontSize:18,color:"#0f172a",marginBottom:6}}>No data yet</p>
            <p style={{color:"#64748b",fontSize:14,marginBottom:20,lineHeight:1.7,maxWidth:360,margin:"0 auto 20px"}}>
              The BillDecoder Index is built from anonymised bill data contributed by users. Be the first to contribute.
            </p>
            <a href="/" style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"13px 32px",fontWeight:700,fontSize:15,display:"inline-block",textDecoration:"none"}}>Analyse your bill</a>
          </div>
        ) : (
          <div>
            {total < 5 && (
              <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center"}}>
                <p style={{fontSize:13,color:"#92400e",lineHeight:1.5}}>Early data — based on only {total} submission{total !== 1 ? "s" : ""} so far. Results will become more meaningful as more Australians contribute.</p>
              </div>
            )}

            {/* Stats grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Avg annual cost</p>
                <p style={{fontSize:28,fontWeight:900,color:"#0f172a",letterSpacing:"-1px"}}>{fmtCost(stats.avgCost)}</p>
              </div>
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Avg overpayment</p>
                <p style={{fontSize:28,fontWeight:900,color:"#dc2626",letterSpacing:"-1px"}}>{fmtCost(stats.avgOverpay)}</p>
              </div>
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Overcharged</p>
                <p style={{fontSize:28,fontWeight:900,color:"#ef4444",letterSpacing:"-1px"}}>{pct(stats.verdicts.overcharged, vTotal)}%</p>
              </div>
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Bills analysed</p>
                <p style={{fontSize:28,fontWeight:900,color:"#10b981",letterSpacing:"-1px"}}>{total}</p>
              </div>
            </div>

            {/* Verdict breakdown bar */}
            {vTotal > 0 && (
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Verdict breakdown</p>
                <div style={{display:"flex",height:32,borderRadius:8,overflow:"hidden",marginBottom:12}}>
                  {stats.verdicts.overcharged > 0 && <div style={{width:pct(stats.verdicts.overcharged,vTotal)+"%",background:"#ef4444",minWidth:stats.verdicts.overcharged>0?2:0}}></div>}
                  {stats.verdicts.fair > 0 && <div style={{width:pct(stats.verdicts.fair,vTotal)+"%",background:"#f59e0b",minWidth:stats.verdicts.fair>0?2:0}}></div>}
                  {stats.verdicts.competitive > 0 && <div style={{width:pct(stats.verdicts.competitive,vTotal)+"%",background:"#10b981",minWidth:stats.verdicts.competitive>0?2:0}}></div>}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <span style={{fontSize:12,color:"#ef4444",fontWeight:700}}>Overcharged {pct(stats.verdicts.overcharged,vTotal)}%</span>
                  <span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>Fair {pct(stats.verdicts.fair,vTotal)}%</span>
                  <span style={{fontSize:12,color:"#10b981",fontWeight:700}}>Competitive {pct(stats.verdicts.competitive,vTotal)}%</span>
                </div>
              </div>
            )}

            {/* Average annual cost by state */}
            {stats.stateStats.length > 0 && (
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Average annual cost by state</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(function() {
                    var maxCost = Math.max.apply(null, stats.stateStats.map(function(s) { return s.avgCost; }));
                    return stats.stateStats.filter(function(s) { return s.avgCost > 0; }).map(function(s) {
                      var w = Math.round((s.avgCost / maxCost) * 100);
                      return (
                        <div key={s.state} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{width:40,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0,textAlign:"right"}}>{s.state}</span>
                          <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:26,overflow:"hidden"}}>
                            <div style={{width:w+"%",height:26,background:"#3b82f6",borderRadius:6}}></div>
                          </div>
                          <span style={{width:75,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{fmtCost(s.avgCost)}/yr</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Average overpayment by state */}
            {stats.stateStats.filter(function(s) { return s.avgOverpay > 0; }).length > 0 && (
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Average overpayment by state</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(function() {
                    var filtered = stats.stateStats.filter(function(s) { return s.avgOverpay > 0; }).sort(function(a, b) { return b.avgOverpay - a.avgOverpay; });
                    var maxOp = Math.max.apply(null, filtered.map(function(s) { return s.avgOverpay; }));
                    return filtered.map(function(s) {
                      var w = Math.round((s.avgOverpay / maxOp) * 100);
                      return (
                        <div key={s.state} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{width:40,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0,textAlign:"right"}}>{s.state}</span>
                          <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:26,overflow:"hidden"}}>
                            <div style={{width:w+"%",height:26,background:"#ef4444",borderRadius:6}}></div>
                          </div>
                          <span style={{width:75,fontSize:13,fontWeight:700,color:"#dc2626",flexShrink:0}}>{fmtCost(s.avgOverpay)}/yr</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Tariff types */}
            {stats.tariffList.length > 0 && (
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Tariff types</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(function() {
                    var maxT = stats.tariffList[0].count;
                    return stats.tariffList.map(function(t) {
                      var w = Math.round((t.count / maxT) * 100);
                      return (
                        <div key={t.name} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{width:120,fontSize:13,fontWeight:600,color:"#64748b",flexShrink:0,textAlign:"right"}}>{t.name}</span>
                          <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:26,overflow:"hidden"}}>
                            <div style={{width:w+"%",height:26,background:"#8b5cf6",borderRadius:6}}></div>
                          </div>
                          <span style={{width:50,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{pct(t.count, total)}%</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Top retailers */}
            {stats.topRetailers.length > 0 && (
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Most common retailers</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(function() {
                    var maxR = stats.topRetailers[0].count;
                    return stats.topRetailers.map(function(r) {
                      var w = Math.round((r.count / maxR) * 100);
                      return (
                        <div key={r.name} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{width:120,fontSize:13,fontWeight:600,color:"#64748b",flexShrink:0,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</span>
                          <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:26,overflow:"hidden"}}>
                            <div style={{width:w+"%",height:26,background:"#f59e0b",borderRadius:6}}></div>
                          </div>
                          <span style={{width:50,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{r.count}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:16,padding:"24px 24px 20px",marginBottom:16,textAlign:"center"}}>
              <p style={{fontWeight:800,fontSize:18,color:"#0f172a",marginBottom:6}}>Want to contribute?</p>
              <p style={{fontSize:14,color:"#166534",marginBottom:18,lineHeight:1.7}}>Analyse your bill and opt in to add your anonymised data to the Index.</p>
              <a href="/" style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"13px 32px",fontWeight:700,fontSize:15,display:"inline-block",textDecoration:"none"}}>Analyse your bill</a>
            </div>

            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:16,marginBottom:20}}>
              <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.7}}>Based on {total} anonymised bill submission{total !== 1 ? "s" : ""} from consenting users. Data is indicative only and does not represent all Australian households. BillDecoder.au is independent and does not receive commissions from any retailer.</p>
            </div>
          </div>
        )}
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"16px 24px",textAlign:"center"}}>
        <p style={{fontSize:11,color:"#cbd5e1"}}>2026 BillDecoder.au — Independent. No retailer commissions.</p>
      </footer>
    </div>
  );
}
