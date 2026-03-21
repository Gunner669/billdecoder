export const metadata = {
  title: "Page not found"
};

export default function NotFound() {
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

      <main style={{maxWidth:480,margin:"0 auto",padding:"80px 16px 64px",textAlign:"center"}}>
        <p style={{fontSize:72,fontWeight:900,color:"#e2e8f0",letterSpacing:"-3px",marginBottom:8}}>404</p>
        <h1 style={{fontSize:24,fontWeight:800,color:"#0f172a",marginBottom:10}}>Page not found</h1>
        <p style={{fontSize:15,color:"#64748b",lineHeight:1.7,marginBottom:28}}>The page you are looking for does not exist or has been moved.</p>
        <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
          <a href="/" style={{background:"#0f172a",color:"#fff",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,textDecoration:"none",display:"inline-block"}}>Analyse your bill</a>
          <a href="/index" style={{background:"#f8fafc",color:"#0f172a",border:"1px solid #e2e8f0",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,textDecoration:"none",display:"inline-block"}}>BillDecoder Index</a>
        </div>
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff",position:"absolute",bottom:0,left:0,right:0}}>
        <div style={{maxWidth:480,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:11,color:"#cbd5e1"}}>&copy; 2026 BillDecoder.au &mdash; Independent. No retailer commissions.</p>
        </div>
      </footer>
    </div>
  );
}
