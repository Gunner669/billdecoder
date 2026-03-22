"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      <header style={{background:"#0f172a",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#10b981",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <a href="/" style={{color:"#fff",fontWeight:800,fontSize:18,textDecoration:"none"}}>BillDecoder<span style={{color:"#10b981"}}>.au</span></a>
        </div>
      </header>

      <main style={{maxWidth:480,margin:"0 auto",padding:"80px 16px 64px",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{background:"#fff5f5",borderRadius:16,width:64,height:64,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h1 style={{fontSize:24,fontWeight:800,color:"#0f172a",marginBottom:10}}>Something went wrong</h1>
        <p style={{fontSize:15,color:"#64748b",lineHeight:1.7,marginBottom:28}}>An unexpected error occurred. This has been noted and we will look into it.</p>
        <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
          <button onClick={reset} style={{background:"#0f172a",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Try again</button>
          <a href="/" style={{background:"#f8fafc",color:"#0f172a",border:"1px solid #e2e8f0",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,textDecoration:"none",display:"inline-block"}}>Back to home</a>
        </div>
      </main>

      <footer style={{borderTop:"1px solid #e2e8f0",padding:"32px 24px 24px",background:"#fff",position:"absolute",bottom:0,left:0,right:0}}>
        <div style={{maxWidth:480,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:11,color:"#cbd5e1"}}>&copy; 2026 BillDecoder.au &mdash; ABN: [pending registration]</p>
        </div>
      </footer>
    </div>
  );
}
