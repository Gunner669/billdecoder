export const metadata = {
  title: "About",
  description: "BillDecoder.au is an independent, free Australian electricity bill analysis tool. No affiliate commissions. Built for Australians.",
  openGraph: {
    title: "About — BillDecoder.au",
    description: "Independent, free Australian electricity bill analysis. No affiliate commissions.",
    url: "https://billdecoder.au/about"
  },
  alternates: {
    canonical: "https://billdecoder.au/about"
  }
};

export default function AboutPage() {
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

      <main style={{maxWidth:680,margin:"0 auto",padding:"40px 16px 64px"}}>
        <h1 style={{fontSize:"clamp(26px,5vw,34px)",fontWeight:900,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:8,color:"#0f172a"}}>About BillDecoder.au</h1>
        <p style={{fontSize:15,color:"#64748b",lineHeight:1.7,marginBottom:32}}>Helping Australians understand what they are actually paying for electricity.</p>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"28px 28px 4px",marginBottom:20}}>
          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Why we built this</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>Australian electricity bills are confusing by design. Tariff structures, supply charges, demand charges, controlled load rates, solar feed-in credits, time-of-use windows — most people have no idea whether they are getting a fair deal or being quietly overcharged.</p>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>BillDecoder.au exists to fix that. Upload your bill, and in under 60 seconds you get a plain-English verdict: are you being overcharged, paying a fair rate, or on a competitive deal? No jargon. No sign-up. No affiliate links pushing you toward a particular retailer.</p>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>How it works</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>BillDecoder.au uses AI to read your electricity bill — the same way an energy consultant would, but in seconds instead of hours. It identifies your retailer, tariff type, usage pattern, and rates, then compares them against current market offers across more than 40 Australian retailers.</p>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>You get a verdict, a comparison chart showing where your bill sits against the state average and the best available deal, specific savings actions with dollar estimates, and retailer recommendations tailored to your usage profile.</p>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Independent and free</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>BillDecoder.au is completely independent. We do not receive commissions, referral fees, or payments from any energy retailer. When we recommend a retailer, it is because the AI determined it is a good fit for your bill — not because someone paid us to say so.</p>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>The service is free to use. No premium tier, no hidden charges, no account required.</p>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Privacy by design</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>Your electricity bill is never stored. It is processed in memory by AI and discarded immediately after your analysis is complete. We cannot retrieve or review your bill after the fact.</p>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>If you choose to share your bill data with the <a href="/bill-index" style={{color:"#3b82f6",fontWeight:600}}>BillDecoder Index</a>, your name, address and account details are stripped out — only pricing data is kept. Read our full <a href="/privacy" style={{color:"#3b82f6",fontWeight:600}}>Privacy Policy</a> for details.</p>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>The BillDecoder Index</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>When users opt in, their de-identified bill data contributes to the BillDecoder Index — a growing dataset of real Australian electricity pricing. The Index shows average costs by state, overpayment rates, verdict breakdowns, and the most common tariff types and retailers across the country.</p>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>The goal is to make electricity pricing more transparent for all Australians, not just those who upload their bills.</p>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Coverage</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>BillDecoder.au works with every Australian electricity retailer across all states and territories: NSW, VIC, QLD, SA, WA, TAS, ACT, and NT. Upload a PDF, photo, or screenshot of your bill in any format.</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {["NSW","VIC","QLD","SA","WA","TAS","ACT","NT"].map(function(s) {
                return <span key={s} style={{background:"#f0fdf4",color:"#15803d",padding:"5px 12px",borderRadius:8,fontSize:13,fontWeight:700}}>{s}</span>;
              })}
            </div>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Who built this</h2>
            <div style={{background:"#f8fafc",borderRadius:12,padding:"20px 20px",border:"1px dashed #cbd5e1"}}>
              <p style={{fontSize:14,color:"#64748b",lineHeight:1.8,fontStyle:"italic"}}>[Founder name and photo to be added]. BillDecoder.au was built because Australian electricity bills are unnecessarily confusing, and the tools that exist to compare them are either too complicated or compromised by retailer commissions.</p>
            </div>
          </div>

          <div style={{marginBottom:28}}>
            <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>Get in touch</h2>
            <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>Have questions, feedback, or a partnership enquiry? Visit our <a href="/contact" style={{color:"#3b82f6",fontWeight:600}}>contact page</a> or email <strong>hello@billdecoder.au</strong>.</p>
          </div>
        </div>
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
            <a href="/" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Analyse your bill</a>
            <a href="/bill-index" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>BillDecoder Index</a>
            <a href="/privacy" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Privacy Policy</a>
            <a href="/contact" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Contact</a>
            <a href="/about" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>About</a>
          </div>
          <p style={{fontSize:11,color:"#cbd5e1"}}>&copy; 2026 BillDecoder.au &mdash; Independent. No retailer commissions. ABN: [pending registration]</p>
        </div>
      </footer>
    </div>
  );
}
