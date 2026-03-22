"use client";
import { useState, useEffect } from "react";

function fmtCost(n) { return "$" + Number(n).toLocaleString(); }
function pct(n, total) { return total > 0 ? Math.round((n / total) * 100) : 0; }

function computeStats(data) {
  var stateStats = Object.keys(data.byState || {}).map(function(s) {
    var st = data.byState[s];
    return { state: s, count: st.count, avgCost: st.avgAnnualCost, avgOverpay: st.avgOverpayment };
  }).sort(function(a, b) { return b.avgCost - a.avgCost; });

  return {
    total: data.totalSubmissions || 0,
    avgCost: data.overallAvgAnnualCost || 0,
    avgOverpay: data.overallAvgOverpayment || 0,
    verdicts: data.verdictBreakdown || { overcharged: 0, fair: 0, competitive: 0 },
    stateStats: stateStats,
    topRetailers: data.topRetailers || [],
    tariffList: data.tariffBreakdown || []
  };
}

export default function IndexDashboard() {
  var [stats, setStats] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    fetch("/api/index-stats").then(function(res) {
      if (res.ok) return res.json();
      throw new Error();
    }).then(function(data) {
      setStats(computeStats(data));
    }).catch(function() {
      setStats({ total: 0, avgCost: 0, avgOverpay: 0, verdicts: { overcharged: 0, fair: 0, competitive: 0 }, stateStats: [], topRetailers: [], tariffList: [] });
    }).finally(function() { setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{textAlign:"center",padding:"60px 16px"}}>
        <style>{"@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}"}</style>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20,maxWidth:760,margin:"0 auto"}}>
          {[1,2,3,4].map(function(i) {
            return (
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <div style={{width:60,height:8,borderRadius:4,margin:"0 auto 10px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                <div style={{width:80,height:28,borderRadius:6,margin:"0 auto",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  var total = stats.total;
  var vTotal = stats.verdicts.overcharged + stats.verdicts.fair + stats.verdicts.competitive;

  if (total === 0) {
    return (
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:"48px 24px",textAlign:"center",maxWidth:520,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
          <div style={{background:"#f0fdf4",borderRadius:16,padding:16}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill="#10b981"/><rect x="10" y="7" width="4" height="14" rx="1" fill="#10b981" opacity="0.7"/><rect x="17" y="3" width="4" height="18" rx="1" fill="#10b981" opacity="0.4"/></svg>
          </div>
        </div>
        <p style={{fontWeight:700,fontSize:18,color:"#0f172a",marginBottom:6}}>No data yet</p>
        <p style={{color:"#64748b",fontSize:14,marginBottom:20,lineHeight:1.7,maxWidth:360,margin:"0 auto 20px"}}>
          The BillDecoder Index is built from real bill data shared by users. Your name and account details are never included. Be the first to contribute.
        </p>
        <a href="/" style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"13px 32px",fontWeight:700,fontSize:15,display:"inline-block",textDecoration:"none"}}>Analyse your bill</a>
      </div>
    );
  }

  return (
    <div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <span style={{display:"inline-block",background:"#f0fdf4",color:"#15803d",padding:"5px 14px",borderRadius:20,fontSize:13,fontWeight:700}}>
          {total} bill{total !== 1 ? "s" : ""} contributed
        </span>
      </div>

      {total < 5 && (
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"center"}}>
          <p style={{fontSize:13,color:"#92400e",lineHeight:1.5}}>Early data — based on only {total} submission{total !== 1 ? "s" : ""} so far. Results will become more meaningful as more Australians contribute.</p>
        </div>
      )}

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

      {vTotal > 0 && (
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
          <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>Verdict breakdown</p>
          <div style={{display:"flex",height:32,borderRadius:8,overflow:"hidden",marginBottom:12}}>
            {stats.verdicts.overcharged > 0 && <div style={{width:pct(stats.verdicts.overcharged,vTotal)+"%",background:"#ef4444",minWidth:2}}></div>}
            {stats.verdicts.fair > 0 && <div style={{width:pct(stats.verdicts.fair,vTotal)+"%",background:"#f59e0b",minWidth:2}}></div>}
            {stats.verdicts.competitive > 0 && <div style={{width:pct(stats.verdicts.competitive,vTotal)+"%",background:"#10b981",minWidth:2}}></div>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:12,color:"#ef4444",fontWeight:700}}>Overcharged {pct(stats.verdicts.overcharged,vTotal)}%</span>
            <span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>Fair {pct(stats.verdicts.fair,vTotal)}%</span>
            <span style={{fontSize:12,color:"#10b981",fontWeight:700}}>Competitive {pct(stats.verdicts.competitive,vTotal)}%</span>
          </div>
        </div>
      )}

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

      <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:16,padding:"24px 24px 20px",marginBottom:16,textAlign:"center"}}>
        <p style={{fontWeight:800,fontSize:18,color:"#0f172a",marginBottom:6}}>Want to contribute?</p>
        <p style={{fontSize:14,color:"#166534",marginBottom:18,lineHeight:1.7}}>Analyse your bill and opt in to add your data to the Index. Only pricing data is kept.</p>
        <a href="/" style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"13px 32px",fontWeight:700,fontSize:15,display:"inline-block",textDecoration:"none"}}>Analyse your bill</a>
      </div>

      <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:16,marginBottom:20}}>
        <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.7}}>Based on {total} de-identified bill submission{total !== 1 ? "s" : ""} from consenting users. Data is indicative only and does not represent all Australian households. BillDecoder.au is independent and does not receive commissions from any retailer.</p>
      </div>
    </div>
  );
}
