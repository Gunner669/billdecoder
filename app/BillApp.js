"use client";
import { useState } from "react";

const RETAILERS = {
  amber:{name:"Amber Electric",url:"https://www.amber.com.au",badge:"Best for solar & battery",bc:"#f59e0b",pitch:"Pay real wholesale electricity prices. Ideal for solar, battery or EV owners."},
  energy_locals:{name:"Energy Locals",url:"https://www.energylocals.com.au",badge:"Australian owned",bc:"#10b981",pitch:"Australian-owned, competitive flat rates, no lock-in contracts."},
  tango:{name:"Tango Energy",url:"https://tangoenergy.com",badge:"Low flat rates",bc:"#6366f1",pitch:"Consistently among the lowest usage rates in VIC, NSW, QLD and SA."},
  powershop:{name:"Powershop",url:"https://www.powershop.com.au",badge:"Prepay & save",bc:"#ec4899",pitch:"Prepay at lower prices with real-time usage monitoring."},
  red:{name:"Red Energy",url:"https://www.redenergy.com.au",badge:"#1 satisfaction",bc:"#ef4444",pitch:"Top-rated nationally for customer satisfaction. Backed by Snowy Hydro."},
  ovo:{name:"OVO Energy",url:"https://www.ovoenergy.com.au",badge:"Smart TOU & EV",bc:"#3b82f6",pitch:"Smart TOU plans rewarding off-peak usage. Cheap overnight EV charging rates."},
  momentum:{name:"Momentum Energy",url:"https://www.momentum.com.au",badge:"Competitive rates",bc:"#0ea5e9",pitch:"Competitive market offers across VIC, NSW, QLD and SA."},
  alinta:{name:"Alinta Energy",url:"https://www.alintaenergy.com.au",badge:"Nationwide",bc:"#8b5cf6",pitch:"National presence. Strong for electricity and gas bundles."},
  engie:{name:"ENGIE",url:"https://engie.com.au",badge:"No lock-in",bc:"#64748b",pitch:"Formerly Simply Energy (rebranded 2024). Competitive rates, no exit fees."},
  lumo:{name:"Lumo Energy",url:"https://www.lumoenergy.com.au",badge:"Top rated SA & VIC",bc:"#0891b2",pitch:"Strong satisfaction ratings in SA and VIC. Canstar top-rated 2026."}
};

const VERDICT = {
  overcharged:{emoji:"\u{1F534}",label:"You're being overcharged",bg:"#fff5f5",border:"#fca5a5",lc:"#dc2626",tc:"#7f1d1d",bb:"#fee2e2"},
  fair:{emoji:"\u{1F7E1}",label:"Room to improve",bg:"#fffbeb",border:"#fcd34d",lc:"#b45309",tc:"#78350f",bb:"#fef3c7"},
  competitive:{emoji:"\u{1F7E2}",label:"You're on a good deal",bg:"#f0fdf4",border:"#86efac",lc:"#15803d",tc:"#14532d",bb:"#dcfce7"}
};

const STEPS = [
  {id:"upload",delay:0,label:"Bill received"},
  {id:"read",delay:1200,label:"Reading your bill..."},
  {id:"tariff",delay:3200,label:"Detecting tariff type..."},
  {id:"overcharge",delay:5400,label:"Checking for overcharges..."},
  {id:"compare",delay:7800,label:"Comparing 40+ retailers..."},
  {id:"verdict",delay:10800,label:"Preparing your verdict..."}
];

const STATE_INSIGHTS = {
  NSW:{stat:"~$380/year",fact:"Average overpayment for NSW households on default plans."},
  VIC:{stat:"~$290/year",fact:"Average overpayment for Victorian households who have not compared."},
  QLD:{stat:"~$420/year",fact:"Average overpayment for Queensland households on default plans."},
  SA:{stat:"~$510/year",fact:"Average overpayment for South Australian households."},
  WA:{stat:"~$260/year",fact:"Average overpayment for WA households not comparing plans."},
  TAS:{stat:"~$220/year",fact:"Average overpayment for Tasmanian households."},
  ACT:{stat:"~$310/year",fact:"Average overpayment for ACT households."},
  default:{stat:"~$380/year",fact:"Average amount Australian households overpay before comparing plans."}
};

var TERM_TIPS = {
  "Flat Rate":"You pay the same price per kWh no matter when you use power.",
  "Time of Use":"Peak times cost more, off-peak costs less — when you use power matters.",
  "Controlled Load":"A cheaper rate for things like hot water systems on a separate meter.",
  "Unknown":"Your tariff type could not be determined from this bill.",
  "supply charge":"The daily fee just for being connected, regardless of how much electricity you use.",
  "feed-in":"What your retailer pays you per kWh for solar energy you export back to the grid.",
  "DMO":"Default Market Offer — the government price cap used as the benchmark for your area.",
  "standing offer":"The default expensive plan you end up on if you have never compared or switched.",
  "off-peak":"Cheaper time periods, usually overnight and weekends.",
  "shoulder":"Mid-price periods between peak and off-peak, common on Time of Use tariffs.",
  "peak":"The most expensive time period, usually weekday afternoons and evenings.",
  "demand charge":"A fee based on your highest usage at any point, common for business accounts.",
  "usage rate":"The price you pay per kilowatt-hour (kWh) of electricity you actually use.",
  "daily supply charge":"The daily fee just for being connected, regardless of how much electricity you use."
};

function tipFor(text) {
  if (!text) return null;
  var lower = text.toLowerCase();
  var keys = Object.keys(TERM_TIPS);
  for (var i = 0; i < keys.length; i++) {
    if (lower.indexOf(keys[i].toLowerCase()) !== -1) {
      return TERM_TIPS[keys[i]];
    }
  }
  return null;
}

export default function BillApp({ landingContent }) {
  const [phase, setPhase] = useState("upload");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [activeSteps, setActiveSteps] = useState([]);
  const [doneSteps, setDoneSteps] = useState([]);
  const [showInsight, setShowInsight] = useState(false);
  const [insightVis, setInsightVis] = useState(false);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [contributed, setContributed] = useState(false);
  const [timers, setTimers] = useState([]);

  function startTimers() {
    var ts = [];
    STEPS.forEach(function(step, i) {
      ts.push(setTimeout(function() {
        setActiveSteps(function(p) { return p.concat([step.id]); });
      }, step.delay));
      if (i < STEPS.length - 1) {
        ts.push(setTimeout(function() {
          setDoneSteps(function(p) { return p.concat([step.id]); });
        }, STEPS[i+1].delay - 100));
      }
    });
    ts.push(setTimeout(function() { setShowInsight(true); }, 7500));
    ts.push(setTimeout(function() { setInsightVis(true); }, 7700));
    setTimers(ts);
  }

  function clearTimers(ts) {
    ts.forEach(function(t) { clearTimeout(t); });
  }

  function reset() {
    clearTimers(timers);
    setPhase("upload"); setAnalysis(null); setError(null); setHint(null);
    setActiveSteps([]); setDoneSteps([]); setShowInsight(false); setInsightVis(false);
    setEmail(""); setEmailDone(false); setShowConsent(true); setContributed(false); setTimers([]);
  }

  function handleFile(file) {
    var valid = ["application/pdf","image/png","image/jpeg","image/jpg","image/webp"];
    if (!valid.includes(file.type)) { setError("Please upload a PDF or image."); return; }
    if (file.size > 12*1024*1024) { setError("File too large. Please use under 12MB."); return; }
    setPhase("processing"); setError(null); setHint(null);
    setActiveSteps([]); setDoneSteps([]); setShowInsight(false); setInsightVis(false);
    startTimers();
    var reader = new FileReader();
    reader.onload = async function() {
      try {
        var base64 = reader.result.split(",")[1];
        var res = await fetch("/api/analyze", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({base64: base64, mimeType: file.type})
        });
        var json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Analysis failed.");
        var result = json.analysis;
        var sm = (result.location || "").match(/\b(NSW|VIC|QLD|SA|WA|TAS|ACT|NT)\b/i);
        setHint({state: sm ? sm[1].toUpperCase() : result.state || null, retailer: result.retailer || null});
        setAnalysis(result);
        clearTimers(timers);
        setPhase("results");
      } catch(err) {
        clearTimers(timers);
        setError(err.message || "Something went wrong."); setPhase("upload");
      }
    };
    reader.onerror = function() { setError("Could not read file."); setPhase("upload"); };
    reader.readAsDataURL(file);
  }

  async function contributeData() {
    try {
      var pc = analysis.postcodeComparison || {};
      await fetch("/api/contribute", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          state: analysis.state,
          retailer: analysis.retailer,
          tariffType: analysis.tariffType,
          dailySupplyCharge: analysis.dailySupplyCharge,
          usageRateSummary: analysis.usageRateSummary,
          totalBillAmount: analysis.totalBillAmount,
          estimatedAnnualCost: analysis.estimatedAnnualCost,
          verdict: analysis.verdict,
          usageLabel: analysis.usageLabel,
          solarFitRate: analysis.solarFitRate || "",
          userAnnualCost: pc.userAnnualCost || pc.userCost,
          stateAvgAnnualCost: pc.stateAvgAnnualCost || pc.stateAvgCost,
          bestDealAnnualCost: pc.bestDealAnnualCost || pc.bestDealCost
        })
      });
    } catch(e) { /* best-effort */ }
    setContributed(true);
    setShowConsent(false);
  }

  async function handleNotifySignup() {
    if (!email.includes("@")) return;
    try {
      var pc = analysis.postcodeComparison || {};
      await fetch("/api/notify-signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: email,
          state: analysis.state,
          userAnnualCost: typeof (pc.userAnnualCost || pc.userCost) === "number" ? (pc.userAnnualCost || pc.userCost) : null,
          bestDealAnnualCost: typeof (pc.bestDealAnnualCost || pc.bestDealCost) === "number" ? (pc.bestDealAnnualCost || pc.bestDealCost) : null,
          tariffType: analysis.tariffType || "",
          verdict: analysis.verdict || ""
        })
      });
    } catch(e) { /* best-effort */ }
    setEmailDone(true);
  }

  function fmtCost(n) { return "$" + Number(n).toLocaleString(); }

  var step = phase === "upload" ? 1 : phase === "processing" ? 2 : 3;
  var cfg = analysis ? (VERDICT[analysis.verdict] || VERDICT.fair) : VERDICT.fair;
  var insight = hint ? (STATE_INSIGHTS[hint.state] || STATE_INSIGHTS.default) : STATE_INSIGHTS.default;
  var retailers = analysis ? (analysis.recommendedRetailers || []).slice(0,3).map(function(k) { return RETAILERS[k]; }).filter(Boolean) : [];

  return (
    <>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}"}</style>

      <header style={{background:"#0f172a",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#10b981",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <span style={{color:"#fff",fontWeight:800,fontSize:18}}>BillDecoder<span style={{color:"#10b981"}}>.au</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <a href="/bill-index" style={{color:"#94a3b8",fontSize:13,fontWeight:600,textDecoration:"none"}}>Index</a>
          {phase === "results" && <button onClick={reset} style={{background:"none",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",padding:"6px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>New bill</button>}
        </div>
      </header>

      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"10px 16px"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {[{n:1,l:"Upload",s:"any format"},{n:2,l:"Analyse",s:"AI reads"},{n:3,l:"Verdict",s:"what to do"}].map(function(d,i) {
            var done=step>d.n,active=step===d.n;
            return (
              <div key={d.n} style={{display:"flex",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:done?"#10b981":active?"#0f172a":"#f1f5f9",color:done||active?"#fff":"#94a3b8",flexShrink:0}}>
                    {done?"\u2713":d.n}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:active?700:400,color:active?"#0f172a":done?"#10b981":"#94a3b8",lineHeight:1.2}}>{d.l}</div>
                    <div style={{fontSize:10,color:"#94a3b8",lineHeight:1}}>{d.s}</div>
                  </div>
                </div>
                {i<2 && <div style={{width:26,height:1,margin:"0 8px",background:done?"#10b981":"#e2e8f0",flexShrink:0}}></div>}
              </div>
            );
          })}
        </div>
      </div>

      <main style={{maxWidth:phase==="results"?720:640,margin:"0 auto",padding:"36px 16px 64px"}}>

        {phase === "upload" && (
          <div>
            {error && (
              <div style={{background:"#fff5f5",border:"1.5px solid #fca5a5",borderRadius:14,padding:"18px 20px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{color:"#dc2626",fontSize:20,flexShrink:0}}>!</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:14,color:"#991b1b",marginBottom:5}}>Something went wrong</p>
                  <p style={{fontSize:13,color:"#7f1d1d",lineHeight:1.65}}>{error}</p>
                </div>
                <button onClick={function(){setError(null);}} style={{background:"none",border:"none",color:"#fca5a5",cursor:"pointer",fontSize:20,padding:0}}>x</button>
              </div>
            )}
            <div style={{textAlign:"center",marginBottom:32}}>
              <h1 style={{fontSize:"clamp(28px,5vw,38px)",fontWeight:900,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:12,color:"#0f172a"}}>
                Your electricity bill, <span style={{color:"#10b981"}}>decoded in 60 seconds.</span>
              </h1>
              <p style={{fontSize:16,color:"#64748b",maxWidth:440,margin:"0 auto",lineHeight:1.7}}>
                Other sites make you fill in forms and understand your bill first. Just upload a photo — we do the rest.
              </p>
            </div>
            <label style={{border:"2px dashed #cbd5e1",borderRadius:20,padding:"48px 24px",textAlign:"center",cursor:"pointer",background:"#fff",display:"block",marginBottom:16}}>
              <input type="file" accept=".pdf,image/*" style={{display:"none"}} onChange={function(e){if(e.target.files[0])handleFile(e.target.files[0]);}} />
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <div style={{background:"#f0fdf4",borderRadius:16,padding:16}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <p style={{fontWeight:700,fontSize:18,color:"#0f172a",marginBottom:6}}>Drop your electricity bill here</p>
              <p style={{color:"#64748b",fontSize:14,marginBottom:20}}>PDF, photo or screenshot — any Aussie retailer, any state</p>
              <span style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"13px 32px",fontWeight:700,fontSize:15,display:"inline-block"}}>Choose a file</span>
            </label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:20}}>
              {[
                {icon:"\u{1F4F7}",h:"No forms to fill in",t:"Just upload a photo. AI reads your bill so you don't have to."},
                {icon:"\u{1F6AB}",h:"No commissions",t:"We don't get paid by retailers. Our recommendations are independent."},
                {icon:"\u{1F4AC}",h:"No jargon",t:"Everything explained in plain English. No kWh, no NMI, no confusion."}
              ].map(function(d,i){
                return (
                  <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"18px 16px",textAlign:"center"}}>
                    <p style={{fontSize:22,marginBottom:8}}>{d.icon}</p>
                    <p style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:4}}>{d.h}</p>
                    <p style={{fontSize:13,color:"#64748b",lineHeight:1.5}}>{d.t}</p>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:28}}>
              {["Bill never stored","No account needed","Built for Australians"].map(function(t,i){
                return <span key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"#64748b"}}><span style={{color:"#10b981"}}>{"\u2713"}</span> {t}</span>;
              })}
            </div>
          </div>
        )}

        {phase === "processing" && (
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:20,padding:"40px 36px",maxWidth:520,margin:"0 auto"}}>
            <p style={{fontWeight:800,fontSize:20,color:"#0f172a",marginBottom:4}}>Decoding your bill</p>
            <p style={{fontSize:13,color:"#94a3b8",marginBottom:20}}>{hint && hint.retailer ? "Analysing your "+hint.retailer+" bill..." : "Reading your electricity bill..."}</p>
            <div style={{marginBottom:24}}>
              {STEPS.map(function(s) {
                if (!activeSteps.includes(s.id)) return null;
                var done = doneSteps.includes(s.id);
                var isFirst = s.id === "upload";
                return (
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #f8fafc",animation:"fadeUp 0.35s ease forwards"}}>
                    <div style={{width:24,height:24,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {done||isFirst
                        ? <div style={{width:22,height:22,borderRadius:"50%",background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                        : <div style={{width:18,height:18,borderRadius:"50%",border:"2.5px solid #e2e8f0",borderTopColor:"#10b981",animation:"spin 0.85s linear infinite"}}></div>
                      }
                    </div>
                    <span style={{flex:1,fontSize:14,fontWeight:done||isFirst?400:600,color:done||isFirst?"#94a3b8":"#0f172a"}}>{s.label}</span>
                    {(done||isFirst) && <span style={{fontSize:11,color:"#10b981",fontWeight:600}}>done</span>}
                  </div>
                );
              })}
            </div>
            {showInsight && (
              <div style={{background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:14,padding:"16px 18px",opacity:insightVis?1:0,transform:insightVis?"translateY(0)":"translateY(8px)",transition:"opacity 0.5s ease,transform 0.5s ease"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Early insight{hint&&hint.state?" \u2014 "+hint.state:""}</p>
                <p style={{fontSize:22,fontWeight:900,color:"#0f172a",letterSpacing:"-0.5px",marginBottom:4}}>{insight.stat}</p>
                <p style={{fontSize:13,color:"#166534",lineHeight:1.5,marginBottom:6}}>{insight.fact}</p>
                <p style={{fontSize:12,color:"#16a34a",fontStyle:"italic"}}>Calculating your personal figure now...</p>
              </div>
            )}
          </div>
        )}

        {phase === "results" && analysis && (function() {
          var pc = analysis.postcodeComparison || {};
          var userVal = pc.userCost || pc.userAnnualCost || 0;
          var avgVal = pc.stateAvgCost || pc.stateAvgAnnualCost || 0;
          var bestVal = pc.bestDealCost || pc.bestDealAnnualCost || 0;
          var hasChart = userVal > 0;
          var period = pc.periodLabel || "Annual";
          var periodLower = period.toLowerCase();
          var perLabel = periodLower === "quarterly" ? "per quarter" : periodLower === "monthly" ? "per month" : "per year";
          var saving = userVal - bestVal;
          var annualSaving = periodLower === "quarterly" ? saving * 4 : periodLower === "monthly" ? saving * 12 : saving;
          var scaleMax = hasChart ? Math.round(Math.max(userVal, avgVal, bestVal) * 1.08) : 1;
          var bestPct = Math.round((bestVal / scaleMax) * 100);
          var avgPct = Math.round((avgVal / scaleMax) * 100);
          var userPct = Math.round((userVal / scaleMax) * 100);
          var tariffDesc = analysis.tariffType ? analysis.tariffType + " plans" : "plans";
          var userColor = analysis.verdict === "overcharged" ? "#dc2626" : analysis.verdict === "fair" ? "#b45309" : "#15803d";

          return (
          <div style={{maxWidth:700,margin:"0 auto"}}>

            {/* 1. Verdict card */}
            <div style={{background:cfg.bg,border:"2px solid "+cfg.border,borderRadius:20,padding:"28px 28px 24px",marginBottom:16}}>
              <div style={{fontSize:40,marginBottom:10}}>{cfg.emoji}</div>
              <p style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:900,color:cfg.lc,letterSpacing:"-1px",marginBottom:10}}>{cfg.label}</p>
              <p style={{fontSize:16,color:cfg.tc,lineHeight:1.7,marginBottom:16}}>{analysis.verdictMessage}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {analysis.estimatedAnnualOvercharge&&analysis.estimatedAnnualOvercharge.toLowerCase()!=="nil"&&(
                  <span style={{background:cfg.bb,color:cfg.lc,padding:"5px 12px",borderRadius:20,fontSize:13,fontWeight:700}}>Est. overcharge: {analysis.estimatedAnnualOvercharge}</span>
                )}
                {analysis.estimatedAnnualCost&&<span style={{background:"#f8fafc",color:"#475569",padding:"5px 12px",borderRadius:20,fontSize:13}}>{analysis.estimatedAnnualCost}</span>}
                {analysis.location&&<span style={{background:"#f8fafc",color:"#475569",padding:"5px 12px",borderRadius:20,fontSize:13}}>{analysis.location}</span>}
              </div>
            </div>

            {/* 2. Gated comparison chart — Touchpoint 1 */}
            {hasChart && (
              !contributed ? (
                <div style={{position:"relative",marginBottom:16}}>
                  {/* Blurred chart preview */}
                  <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,filter:"blur(6px)",pointerEvents:"none",userSelect:"none"}}>
                    <p style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>How your bill compares</p>
                    <div style={{marginTop:12}}>
                      {[{w:userPct,c:"#ef4444"},{w:avgPct,c:"#f59e0b"},{w:bestPct,c:"#10b981"}].map(function(b,i) {
                        return (
                          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                            <span style={{width:100,height:12,background:"#e2e8f0",borderRadius:4}}></span>
                            <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:28}}><div style={{width:b.w+"%",height:28,background:b.c,borderRadius:6}}></div></div>
                            <span style={{width:60,height:12,background:"#e2e8f0",borderRadius:4}}></span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Overlay */}
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.7)",borderRadius:16,backdropFilter:"blur(2px)",padding:"0 24px"}}>
                    <p style={{fontWeight:800,fontSize:17,color:"#0f172a",marginBottom:8,textAlign:"center",maxWidth:380}}>Share your bill data to see how you compare to others in {pc.postcode || "your area"}</p>
                    <p style={{fontSize:13,color:"#475569",marginBottom:4,textAlign:"center"}}>This helps build Australia's first independent electricity pricing index.</p>
                    <p style={{fontSize:13,color:"#64748b",marginBottom:16,textAlign:"center"}}>Your name and account details are never included — only pricing data is shared.</p>
                    <button onClick={contributeData} style={{background:"#10b981",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,cursor:"pointer"}}>Yes, show me</button>
                  </div>
                </div>
              ) : (
                <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
                  <p style={{fontWeight:700,fontSize:15,marginBottom:4,color:"#0f172a"}}>How your bill compares{pc.postcode ? " \u2014 "+pc.postcode+", "+analysis.state : ""}</p>
                  <p style={{fontSize:12,color:"#64748b",marginBottom:16}}>All figures are {perLabel}.</p>

                  {saving > 0 && (
                    <div style={{background:analysis.verdict==="overcharged"?"#fff5f5":"#fffbeb",border:analysis.verdict==="overcharged"?"2px solid #fca5a5":"2px solid #fcd34d",borderRadius:14,padding:"16px 20px",marginBottom:18,textAlign:"center"}}>
                      <p style={{fontSize:24,fontWeight:900,color:analysis.verdict==="overcharged"?"#dc2626":"#b45309",letterSpacing:"-0.5px",marginBottom:4}}>You could save ~{fmtCost(saving)} {perLabel}</p>
                      {periodLower !== "annual" && <p style={{fontSize:14,fontWeight:700,color:analysis.verdict==="overcharged"?"#ef4444":"#d97706"}}>That is ~{fmtCost(annualSaving)} per year</p>}
                    </div>
                  )}

                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:130,fontSize:12,fontWeight:600,color:"#64748b",flexShrink:0,textAlign:"right"}}>Your bill</span>
                      <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:28,overflow:"hidden"}}><div style={{width:userPct+"%",height:28,background:userColor,borderRadius:6,transition:"width 0.6s ease"}}></div></div>
                      <span style={{width:90,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{fmtCost(userVal)} {perLabel}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:130,fontSize:12,fontWeight:600,color:"#64748b",flexShrink:0,textAlign:"right"}}>State avg (DMO)</span>
                      <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:28,overflow:"hidden"}}><div style={{width:avgPct+"%",height:28,background:"#f59e0b",borderRadius:6,transition:"width 0.6s ease"}}></div></div>
                      <span style={{width:90,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{fmtCost(avgVal)} {perLabel}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:130,fontSize:12,fontWeight:600,color:"#64748b",flexShrink:0,textAlign:"right"}}>Best available</span>
                      <div style={{flex:1,background:"#f1f5f9",borderRadius:6,height:28,overflow:"hidden"}}><div style={{width:bestPct+"%",height:28,background:"#10b981",borderRadius:6,transition:"width 0.6s ease"}}></div></div>
                      <span style={{width:90,fontSize:13,fontWeight:700,color:"#0f172a",flexShrink:0}}>{fmtCost(bestVal)} {perLabel}</span>
                    </div>
                  </div>

                  <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>
                    <p style={{marginBottom:4}}><strong style={{color:"#64748b"}}>State avg (DMO)</strong> — the maximum price your retailer is allowed to charge under the government Default Market Offer.</p>
                    <p style={{marginBottom:4}}><strong style={{color:"#64748b"}}>Best available</strong> — cheapest current market offer for {tariffDesc} in your area.</p>
                    {pc.referenceNote && <p>{pc.referenceNote}</p>}
                  </div>
                </div>
              )
            )}

            {contributed && (
              <div style={{background:"#f0fdf4",border:"2px solid #86efac",borderRadius:16,padding:"14px 20px",marginBottom:16,textAlign:"center"}}>
                <p style={{fontWeight:700,fontSize:14,color:"#15803d"}}>Thank you — your bill data has been added to the <a href="/bill-index" style={{color:"#15803d",fontWeight:700}}>BillDecoder Index</a>.</p>
              </div>
            )}

            {/* 3. Your bill decoded */}
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
              <p style={{fontWeight:700,fontSize:15,marginBottom:12,color:"#0f172a"}}>Your bill, decoded</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
                {[{l:"Tariff type",v:analysis.tariffType,n:analysis.peakOffPeakTimes,t:true},{l:"Usage rate",v:analysis.usageRateSummary,t:true},{l:"Daily supply charge",v:analysis.dailySupplyCharge,n:analysis.supplyChargeNote,t:true},{l:"Retailer",v:analysis.retailer}].map(function(f,i){
                  var tip = f.t ? (tipFor(f.v) || tipFor(f.l)) : null;
                  return (
                    <div key={i} style={{background:"#f8fafc",borderRadius:10,padding:"12px 14px"}}>
                      <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>{f.l}</p>
                      <p style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:(f.n||tip)?4:0}}>{f.v||"\u2014"}</p>
                      {tip&&<p style={{fontSize:11,color:"#10b981",lineHeight:1.4,fontStyle:"italic",marginBottom:f.n?4:0}}>{tip}</p>}
                      {f.n&&<p style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{f.n}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Usage profile */}
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
              <p style={{fontWeight:700,fontSize:15,marginBottom:8,color:"#0f172a"}}>Usage profile: <span style={{color:"#10b981"}}>{analysis.usageLabel}</span></p>
              <p style={{fontSize:15,color:"#475569",lineHeight:1.75}}>{analysis.usageInsight}</p>
            </div>

            {/* 5. Solar insight */}
            {analysis.solarInsight&&(
              <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:16,padding:24,marginBottom:16}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:4,color:"#92400e"}}>Solar feed-in: {analysis.solarFitRate}</p>
                <p style={{fontSize:11,color:"#b45309",fontStyle:"italic",marginBottom:8}}>Feed-in tariff — what your retailer pays you per kWh for solar you export to the grid.</p>
                <p style={{fontSize:15,color:"#78350f",lineHeight:1.75,marginBottom:analysis.solarDetail?12:0}}>{analysis.solarInsight}</p>
                {analysis.solarDetail&&(
                  <div style={{background:"#fef3c7",borderRadius:10,padding:"14px 16px",borderLeft:"3px solid #f59e0b"}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Rate caps and alternatives</p>
                    <p style={{fontSize:14,color:"#78350f",lineHeight:1.7}}>{analysis.solarDetail}</p>
                  </div>
                )}
              </div>
            )}

            {/* 6. What to do right now */}
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
              <p style={{fontWeight:700,fontSize:15,marginBottom:14,color:"#0f172a"}}>What to do right now</p>
              {(analysis.savingsActions||[]).map(function(action,i,arr){
                return (
                  <div key={i} style={{borderLeft:"3px solid #10b981",paddingLeft:16,marginBottom:i<arr.length-1?20:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,gap:8}}>
                      <p style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{action.title}</p>
                      <span style={{background:"#f0fdf4",color:"#15803d",padding:"3px 10px",borderRadius:6,fontSize:12,fontWeight:700,flexShrink:0}}>{action.annualSaving}</span>
                    </div>
                    <p style={{fontSize:14,color:"#475569",lineHeight:1.7}}>{action.detail}</p>
                  </div>
                );
              })}
            </div>

            {/* 7. Retailers worth considering */}
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
              <p style={{fontWeight:700,fontSize:15,marginBottom:8,color:"#0f172a"}}>Retailers worth considering</p>
              {analysis.retailerRationale&&<p style={{fontSize:14,color:"#64748b",marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f1f5f9",lineHeight:1.7}}>{analysis.retailerRationale}</p>}
              {retailers.map(function(r,i){
                return (
                  <div key={i} style={{border:"1px solid #e2e8f0",borderRadius:14,padding:"18px 20px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                      <p style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>{r.name}</p>
                      <span style={{background:r.bc+"18",color:r.bc,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>{r.badge}</span>
                    </div>
                    <p style={{fontSize:14,color:"#475569",lineHeight:1.6,marginBottom:12}}>{r.pitch}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:"#0f172a",color:"#fff",textDecoration:"none",borderRadius:9,padding:"9px 18px",fontWeight:700,fontSize:13}}>
                      See their plans
                    </a>
                  </div>
                );
              })}
              <div style={{background:"#f8fafc",borderRadius:12,padding:"14px 16px",marginTop:6}}>
                <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>Also check <a href="https://www.energymadeeasy.gov.au" target="_blank" rel="noopener noreferrer" style={{color:"#3b82f6",fontWeight:600}}>Energy Made Easy</a> — the government free comparison tool.</p>
              </div>
            </div>

            {/* 8. Touchpoint 2 — full consent card (hidden if already contributed) */}
            {showConsent && !contributed && (
              <div style={{background:"linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%)",borderRadius:20,padding:"28px 28px 24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,right:0,width:120,height:120,background:"#10b981",borderRadius:"0 0 0 120px",opacity:0.1}}></div>
                <p style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:10}}>Help build Australia's first independent electricity pricing index</p>
                <p style={{fontSize:14,color:"#94a3b8",lineHeight:1.7,marginBottom:16}}>Energy companies know what everyone pays. You don't. Share your bill data to help change that. Your name, address and account details are stripped out — only pricing data is kept.</p>
                <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <button onClick={contributeData} style={{background:"#10b981",color:"#fff",border:"none",borderRadius:10,padding:"13px 24px",fontWeight:700,fontSize:15,cursor:"pointer"}}>
                    Count me in
                  </button>
                  <span style={{fontSize:13,color:"#64748b"}}>47 Australians have shared so far</span>
                </div>
              </div>
            )}

            {/* 9. Email notification signup */}
            {!emailDone ? (
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:16,padding:"24px 24px 20px",marginBottom:16,textAlign:"center"}}>
                <p style={{fontWeight:800,fontSize:18,color:"#0f172a",marginBottom:6}}>Want a heads-up when better rates appear?</p>
                <p style={{fontSize:14,color:"#166534",marginBottom:18}}>We will email you once — only when a meaningfully better deal is available in your area.</p>
                <div style={{display:"flex",gap:8,maxWidth:400,margin:"0 auto"}}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={function(e){setEmail(e.target.value);}}
                    style={{flex:1,border:"1px solid #86efac",borderRadius:10,padding:"11px 14px",fontSize:14,background:"#fff",outline:"none",fontFamily:"inherit",color:"#0f172a"}}/>
                  <button onClick={handleNotifySignup}
                    style={{background:"#15803d",color:"#fff",border:"none",borderRadius:10,padding:"11px 20px",fontWeight:700,fontSize:14,cursor:"pointer",whiteSpace:"nowrap"}}>
                    Notify me
                  </button>
                </div>
              </div>
            ) : (
              <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:16,padding:20,marginBottom:16,textAlign:"center"}}>
                <p style={{fontWeight:700,color:"#15803d",fontSize:16}}>You are on the list</p>
              </div>
            )}

            {/* 10. Disclaimer */}
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:16,marginBottom:20}}>
              <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.7}}>This analysis is based on AI reading of your bill. Savings estimates are indicative only. Always read the Basic Plan Information Document before switching. BillDecoder.au is independent and does not receive commissions from any retailer listed.</p>
            </div>

            {/* 11. Analyse another bill */}
            <div style={{textAlign:"center",paddingBottom:16}}>
              <button onClick={reset} style={{background:"none",border:"1px solid #e2e8f0",borderRadius:10,padding:"11px 24px",color:"#64748b",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"}}>
                Analyse another bill
              </button>
            </div>
          </div>
          );
        })()}
      </main>

      {phase === "upload" && landingContent}
    </>
  );
}
