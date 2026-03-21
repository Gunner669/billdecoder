export default function Loading() {
  return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#0f172a"}}>
      <style>{"@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}"}</style>

      <header style={{background:"#0f172a",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#10b981",borderRadius:9,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff"/></svg>
          </div>
          <span style={{color:"#fff",fontWeight:800,fontSize:18}}>BillDecoder<span style={{color:"#10b981"}}>.au</span></span>
        </div>
      </header>

      <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"10px 16px"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
          {[1,2,3].map(function(i) {
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#f1f5f9"}}></div>
                <div>
                  <div style={{width:50,height:10,borderRadius:4,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                  <div style={{width:36,height:8,borderRadius:4,marginTop:3,background:"#f8fafc"}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <main style={{maxWidth:640,margin:"0 auto",padding:"36px 16px 64px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:340,height:36,borderRadius:8,margin:"0 auto 12px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
          <div style={{width:260,height:16,borderRadius:6,margin:"0 auto",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
        </div>

        <div style={{border:"2px dashed #e2e8f0",borderRadius:20,padding:"48px 24px",background:"#fff",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
          </div>
          <div style={{width:220,height:16,borderRadius:6,margin:"0 auto 8px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
          <div style={{width:300,height:12,borderRadius:6,margin:"0 auto 20px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
          <div style={{width:140,height:44,borderRadius:12,margin:"0 auto",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
        </div>

        <div style={{display:"flex",justifyContent:"center",gap:20}}>
          {[1,2,3].map(function(i) {
            return <div key={i} style={{width:110,height:12,borderRadius:4,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>;
          })}
        </div>
      </main>
    </div>
  );
}
