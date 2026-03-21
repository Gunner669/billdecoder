export const metadata = {
  title: "Privacy Policy",
  description: "How BillDecoder.au handles your data. Your bill is never stored. Independent and transparent.",
  openGraph: {
    title: "Privacy Policy — BillDecoder.au",
    description: "How BillDecoder.au handles your data. Your bill is never stored.",
    url: "https://billdecoder.au/privacy"
  },
  alternates: {
    canonical: "https://billdecoder.au/privacy"
  }
};

function Section({ title, children }) {
  return (
    <div style={{marginBottom:28}}>
      <h2 style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:10}}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:10}}>{children}</p>;
}

function Li({ children }) {
  return <li style={{fontSize:15,color:"#475569",lineHeight:1.8,marginBottom:4}}>{children}</li>;
}

export default function PrivacyPage() {
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
        <h1 style={{fontSize:"clamp(26px,5vw,34px)",fontWeight:900,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:8,color:"#0f172a"}}>Privacy Policy</h1>
        <p style={{fontSize:14,color:"#94a3b8",marginBottom:32}}>Last updated: 21 March 2026</p>

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"28px 28px 4px"}}>
          <Section title="Overview">
            <P>BillDecoder.au is an independent Australian electricity bill analysis tool. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</P>
            <P>The short version: <strong>your electricity bill is never stored</strong>. We collect the minimum data needed to provide the service and nothing more.</P>
          </Section>

          <Section title="Bill analysis">
            <P>When you upload an electricity bill for analysis:</P>
            <ul style={{paddingLeft:20,marginBottom:10}}>
              <Li>Your bill is sent to our AI analysis service (Claude by Anthropic) for processing.</Li>
              <Li>The bill is processed in memory only and is <strong>never saved</strong> to any server, database, or file system.</Li>
              <Li>Once the analysis is complete, the bill data is discarded. We cannot retrieve it.</Li>
              <Li>The analysis results are displayed in your browser and are not stored on our servers.</Li>
            </ul>
          </Section>

          <Section title="Anonymised bill data (opt-in)">
            <P>After receiving your analysis, you may choose to contribute anonymised data to the BillDecoder Index. This is entirely optional.</P>
            <P>If you opt in, we store only:</P>
            <ul style={{paddingLeft:20,marginBottom:10}}>
              <Li>State (e.g. NSW, VIC)</Li>
              <Li>Retailer name</Li>
              <Li>Tariff type, usage rates, daily supply charge</Li>
              <Li>Total bill amount and estimated annual cost</Li>
              <Li>Verdict (overcharged, fair, or competitive)</Li>
              <Li>Usage label (e.g. Evening Peaker)</Li>
              <Li>Solar feed-in rate (if applicable)</Li>
            </ul>
            <P>We <strong>never store</strong> your name, address, postcode, account number, or any text that could identify you personally. The anonymised data cannot be linked back to you.</P>
            <P>This data is used to generate aggregate insights on the <a href="/bill-index" style={{color:"#3b82f6",fontWeight:600}}>BillDecoder Index</a>.</P>
          </Section>

          <Section title="Email notifications (opt-in)">
            <P>You may choose to provide your email address to receive a one-time notification when better electricity deals are available in your state.</P>
            <P>If you opt in, we store:</P>
            <ul style={{paddingLeft:20,marginBottom:10}}>
              <Li>Your email address</Li>
              <Li>Your state</Li>
              <Li>Your estimated annual cost and tariff type at the time of signup</Li>
            </ul>
            <P>We will send you <strong>at most one email</strong>. Every email includes an unsubscribe link. Your email is stored separately from anonymised bill data and cannot be cross-linked.</P>
            <P>We use <a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{color:"#3b82f6",fontWeight:600}}>Resend</a> to deliver emails.</P>
          </Section>

          <Section title="Data storage and security">
            <P>All stored data (anonymised bill contributions and email subscriptions) is held in Vercel KV, a managed Redis database hosted by Vercel. Data is encrypted in transit and at rest.</P>
            <P>We do not sell, share, or provide your data to any third party, except:</P>
            <ul style={{paddingLeft:20,marginBottom:10}}>
              <Li><strong>Anthropic</strong> — your bill is sent to Claude AI for analysis (processed in memory, not stored by Anthropic for training).</Li>
              <Li><strong>Resend</strong> — your email address is provided to send the notification email, if you opted in.</Li>
              <Li><strong>Vercel</strong> — hosts the application and database infrastructure.</Li>
            </ul>
          </Section>

          <Section title="Cookies and tracking">
            <P>BillDecoder.au does not use cookies, tracking pixels, analytics services, or advertising. We do not track your browsing behaviour.</P>
          </Section>

          <Section title="Your rights">
            <P>You have the right to:</P>
            <ul style={{paddingLeft:20,marginBottom:10}}>
              <Li><strong>Not participate</strong> — bill analysis works without contributing data or providing your email.</Li>
              <Li><strong>Unsubscribe</strong> — every notification email includes a one-click unsubscribe link.</Li>
              <Li><strong>Request deletion</strong> — contact us to have any stored data associated with your email removed.</Li>
            </ul>
            <P>Under the Australian Privacy Act 1988, you have additional rights regarding the handling of your personal information.</P>
          </Section>

          <Section title="Independence">
            <P>BillDecoder.au is independent. We do not receive commissions, payments, or incentives from any energy retailer. Retailer recommendations are based solely on AI analysis of your bill.</P>
          </Section>

          <Section title="Changes to this policy">
            <P>We may update this privacy policy from time to time. The date at the top of this page indicates when it was last revised.</P>
          </Section>

          <Section title="Contact">
            <P>For privacy enquiries or data deletion requests, visit <a href="https://billdecoder.au" style={{color:"#3b82f6",fontWeight:600}}>billdecoder.au</a>.</P>
          </Section>
        </div>
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
            <a href="/" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Analyse your bill</a>
            <a href="/bill-index" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>BillDecoder Index</a>
            <a href="/privacy" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Privacy Policy</a>
          </div>
          <p style={{fontSize:11,color:"#cbd5e1"}}>&copy; 2026 BillDecoder.au &mdash; Independent. No retailer commissions.</p>
        </div>
      </footer>
    </div>
  );
}
