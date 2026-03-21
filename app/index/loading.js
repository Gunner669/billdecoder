export default function IndexLoading() {
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

      <main style={{maxWidth:760,margin:"0 auto",padding:"36px 16px 64px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:280,height:34,borderRadius:8,margin:"0 auto 12px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
          <div style={{width:360,height:16,borderRadius:6,margin:"0 auto",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
          {[1,2,3,4].map(function(i) {
            return (
              <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <div style={{width:60,height:8,borderRadius:4,margin:"0 auto 10px",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                <div style={{width:80,height:28,borderRadius:6,margin:"0 auto",background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
              </div>
            );
          })}
        </div>

        {[1,2].map(function(i) {
          return (
            <div key={i} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24,marginBottom:16}}>
              <div style={{width:200,height:14,borderRadius:6,marginBottom:16,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
              {[1,2,3].map(function(j) {
                return (
                  <div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:40,height:12,borderRadius:4,flexShrink:0,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                    <div style={{flex:1,height:26,borderRadius:6,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                    <div style={{width:60,height:12,borderRadius:4,flexShrink:0,background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",backgroundSize:"800px",animation:"shimmer 1.5s infinite linear"}}></div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </div>
  );
}
