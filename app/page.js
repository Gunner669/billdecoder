import BillApp from "./BillApp";

var FAQ_DATA = [
  {q:"Is BillDecoder.au free?",a:"Yes, completely free. No hidden charges, no premium tier, no affiliate commissions."},
  {q:"Is my electricity bill stored?",a:"No. Your bill is processed in memory by AI and never saved to any server or database. Once your analysis is complete, the bill data is gone."},
  {q:"What electricity retailers do you cover?",a:"All Australian electricity retailers. Whether you are with AGL, Origin, EnergyAustralia, or any of 40+ other retailers, BillDecoder.au can read and analyse your bill."},
  {q:"What states and territories are covered?",a:"All of them — NSW, VIC, QLD, SA, WA, TAS, ACT, and NT. The analysis accounts for state-specific tariff structures, Default Market Offers, and Victorian Default Offers."},
  {q:"What file formats can I upload?",a:"PDF, PNG, JPEG, and WebP files up to 12MB. You can upload the PDF from your retailer, a photo of a paper bill, or a screenshot."},
  {q:"How accurate is the analysis?",a:"BillDecoder.au uses AI to read your bill and compare it against current market offers. Savings estimates are indicative. Always read the Basic Plan Information Document (BPID) before switching retailers."},
  {q:"How does BillDecoder.au make money?",a:"It does not, currently. BillDecoder.au is an independent project. We do not receive commissions or payments from any energy retailer."},
  {q:"What is the BillDecoder Index?",a:"The BillDecoder Index is an aggregate view of anonymised electricity bill data contributed by users who opt in. It shows average costs, overpayment rates, and tariff breakdowns across Australian states."}
];

var FAQ_JSONLD = {
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity": FAQ_DATA.map(function(item) {
    return {"@type":"Question","name":item.q,"acceptedAnswer":{"@type":"Answer","text":item.a}};
  })
};

var APP_JSONLD = {
  "@context":"https://schema.org",
  "@type":"WebApplication",
  "name":"BillDecoder.au",
  "url":"https://billdecoder.au",
  "applicationCategory":"UtilitiesApplication",
  "operatingSystem":"Any",
  "offers":{"@type":"Offer","price":"0","priceCurrency":"AUD"},
  "description":"Upload your Australian electricity bill and get a plain-English verdict in 60 seconds. Free, independent analysis with no affiliate commissions.",
  "aggregateRating":undefined
};

function HowItWorks() {
  var steps = [
    {icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,title:"Upload your bill",desc:"PDF, photo, or screenshot from any Australian retailer."},
    {icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21h6M10 17h4" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/></svg>,title:"AI reads your bill",desc:"Detects your tariff, rates, and usage pattern in seconds."},
    {icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 4L12 14.01l-3-3" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,title:"Get your verdict",desc:"Plain-English verdict, savings actions, and retailer recommendations."}
  ];
  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 16px 0"}}>
      <h2 style={{textAlign:"center",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:8}}>How it works</h2>
      <p style={{textAlign:"center",fontSize:14,color:"#64748b",marginBottom:28}}>Three steps. Under 60 seconds. No sign-up required.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:16}}>
        {steps.map(function(s,i) {
          return (
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                <div style={{background:"#f0fdf4",borderRadius:12,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
              </div>
              <p style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:6}}>{s.title}</p>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Benefits() {
  var items = [
    {title:"Works with any retailer",desc:"AGL, Origin, EnergyAustralia, or any of 40+ Australian retailers."},
    {title:"Any format accepted",desc:"PDF from your inbox, photo of a paper bill, or a screenshot."},
    {title:"AI-powered analysis",desc:"Reads your bill like an energy consultant, identifying overcharges and savings."},
    {title:"Independent and honest",desc:"No affiliate commissions. No sponsored results. Just honest analysis."},
    {title:"Privacy first",desc:"Your bill is never stored. No account needed. Processed in memory only."},
    {title:"Built for Australia",desc:"Understands Australian tariff types, DMO, VDO, and state-specific regulations."}
  ];
  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 16px 0"}}>
      <h2 style={{textAlign:"center",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:28}}>Why Australians use BillDecoder</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12}}>
        {items.map(function(item,i) {
          return (
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"18px 20px",display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{color:"#10b981",fontSize:16,fontWeight:700,flexShrink:0,marginTop:1}}>{"\u2713"}</span>
              <div>
                <p style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:4}}>{item.title}</p>
                <p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WhatYouGet() {
  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 16px 0"}}>
      <h2 style={{textAlign:"center",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:8}}>What you will get</h2>
      <p style={{textAlign:"center",fontSize:14,color:"#64748b",marginBottom:28}}>A complete breakdown of your electricity bill, in plain English.</p>
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[
            {title:"Clear verdict",desc:"Overcharged, fair, or competitive — with an estimated annual overcharge amount."},
            {title:"Bill breakdown",desc:"Tariff type, usage rates, daily supply charge, and how they compare to your state."},
            {title:"Comparison chart",desc:"See where your bill sits against the state average and the best available deal."},
            {title:"Usage profile",desc:"Evening Peaker, Daytime User, Night Owl — understand your consumption pattern."},
            {title:"Savings actions",desc:"3-4 specific steps to reduce your bill, with estimated dollar savings for each."},
            {title:"Retailer picks",desc:"2-3 retailers suited to your tariff type, usage pattern, and location."}
          ].map(function(item,i) {
            return (
              <div key={i} style={{borderLeft:"3px solid #10b981",paddingLeft:14}}>
                <p style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:3}}>{item.title}</p>
                <p style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function States() {
  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 16px 0",textAlign:"center"}}>
      <h2 style={{fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:8}}>Covering every state and territory</h2>
      <p style={{fontSize:14,color:"#64748b",marginBottom:20}}>Accurate analysis tuned to your state's energy market.</p>
      <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
        {["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"].map(function(s) {
          return <span key={s} style={{background:"#f0fdf4",color:"#15803d",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:700}}>{s}</span>;
        })}
      </div>
      <div style={{marginTop:20}}>
        <a href="/index" style={{color:"#3b82f6",fontSize:14,fontWeight:600,textDecoration:"none"}}>View the BillDecoder Index →</a>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 16px 0"}}>
      <h2 style={{textAlign:"center",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:28}}>Frequently asked questions</h2>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {FAQ_DATA.map(function(item,i) {
          return (
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"18px 20px"}}>
              <p style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:6}}>{item.q}</p>
              <p style={{fontSize:14,color:"#475569",lineHeight:1.7}}>{item.a}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff",marginTop:48}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{background:"#10b981",borderRadius:9,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <span style={{fontWeight:800,fontSize:16,color:"#0f172a"}}>BillDecoder<span style={{color:"#10b981"}}>.au</span></span>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:16}}>
          <a href="/" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Analyse your bill</a>
          <a href="/index" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>BillDecoder Index</a>
          <a href="https://www.energymadeeasy.gov.au" target="_blank" rel="noopener noreferrer" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Energy Made Easy</a>
        </div>
        <div style={{borderTop:"1px solid #f1f5f9",paddingTop:16,display:"flex",flexDirection:"column",gap:6}}>
          <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>BillDecoder.au is independent and does not receive commissions from any energy retailer. Your bill data is never stored.</p>
          <p style={{fontSize:11,color:"#cbd5e1"}}>© 2026 BillDecoder.au</p>
        </div>
      </div>
    </footer>
  );
}

function LandingContent() {
  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#f8fafc",color:"#0f172a"}}>
      <HowItWorks />
      <WhatYouGet />
      <Benefits />
      <States />
      <Faq />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(FAQ_JSONLD)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(APP_JSONLD)}} />
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      <BillApp landingContent={<LandingContent />} />
    </div>
  );
}
