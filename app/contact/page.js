import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description: "Get in touch with BillDecoder.au. Questions, feedback, data deletion requests, or partnership enquiries.",
  openGraph: {
    title: "Contact — BillDecoder.au",
    description: "Get in touch with BillDecoder.au.",
    url: "https://billdecoder.au/contact"
  },
  alternates: {
    canonical: "https://billdecoder.au/contact"
  }
};

export default function ContactPage() {
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

      <main style={{maxWidth:560,margin:"0 auto",padding:"40px 16px 64px"}}>
        <h1 style={{fontSize:"clamp(26px,5vw,34px)",fontWeight:900,letterSpacing:"-1.5px",lineHeight:1.15,marginBottom:8,color:"#0f172a"}}>Contact us</h1>
        <p style={{fontSize:15,color:"#64748b",lineHeight:1.7,marginBottom:32}}>Questions, feedback, data deletion requests, or just want to say hello? We would love to hear from you.</p>

        <ContactForm />

        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginTop:24}}>
          <p style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:10}}>Common enquiries</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <p style={{fontWeight:600,fontSize:14,color:"#0f172a",marginBottom:3}}>Data deletion</p>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>If you signed up for email notifications and want your data removed, send us a message with the email address you used and we will delete it promptly.</p>
            </div>
            <div>
              <p style={{fontWeight:600,fontSize:14,color:"#0f172a",marginBottom:3}}>Bill analysis issues</p>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>If your bill was not analysed correctly, try uploading a clearer image or the original PDF. Our AI works best with high-resolution, single-page bills.</p>
            </div>
            <div>
              <p style={{fontWeight:600,fontSize:14,color:"#0f172a",marginBottom:3}}>Partnerships and media</p>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6}}>For partnership or media enquiries, use the form above and include relevant details. We aim to respond within 48 hours.</p>
            </div>
          </div>
        </div>
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
            <a href="/" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Analyse your bill</a>
            <a href="/index" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>BillDecoder Index</a>
            <a href="/privacy" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Privacy Policy</a>
            <a href="/contact" style={{color:"#64748b",fontSize:13,textDecoration:"none",fontWeight:600}}>Contact</a>
          </div>
          <p style={{fontSize:11,color:"#cbd5e1"}}>&copy; 2026 BillDecoder.au &mdash; Independent. No retailer commissions.</p>
        </div>
      </footer>
    </div>
  );
}
