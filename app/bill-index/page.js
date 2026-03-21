import IndexDashboard from "./IndexDashboard";

export const metadata = {
  title: "BillDecoder Index — Australian Electricity Bill Insights",
  description: "Real aggregate insights from anonymised Australian electricity bills contributed by Australians.",
  openGraph: {
    title: "BillDecoder Index — Australian Electricity Bill Insights",
    description: "Average costs, overpayment rates, and tariff breakdowns from real Australian electricity bills.",
    url: "https://billdecoder.au/bill-index"
  },
  alternates: {
    canonical: "https://billdecoder.au/bill-index"
  }
};

export default function IndexPage() {
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
        </div>

        <IndexDashboard />
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"16px 24px",textAlign:"center"}}>
        <p style={{fontSize:11,color:"#cbd5e1"}}>2026 BillDecoder.au — Independent. No retailer commissions.</p>
      </footer>
    </div>
  );
}
