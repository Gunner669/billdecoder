"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || !message.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      var res = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name: name, email: email, message: message })
      });
      var json = await res.json();
      if (res.ok && json.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch(err) {
      setStatus("error");
    }
    setSending(false);
  }

  if (status === "sent") {
    return (
      <div style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:16,padding:"28px 24px",textAlign:"center"}}>
        <p style={{fontWeight:700,fontSize:18,color:"#15803d",marginBottom:6}}>Message sent</p>
        <p style={{fontSize:14,color:"#166534",lineHeight:1.7}}>Thanks for getting in touch. We will get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:24}}>
      {status === "error" && (
        <div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:10,padding:"12px 16px",marginBottom:16}}>
          <p style={{fontSize:13,color:"#991b1b"}}>Something went wrong. Please try again.</p>
        </div>
      )}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:6}}>Name</label>
        <input type="text" value={name} onChange={function(e){setName(e.target.value);}} required
          style={{width:"100%",border:"1px solid #e2e8f0",borderRadius:10,padding:"11px 14px",fontSize:14,background:"#fff",outline:"none",fontFamily:"inherit",color:"#0f172a",boxSizing:"border-box"}} />
      </div>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:6}}>Email</label>
        <input type="email" value={email} onChange={function(e){setEmail(e.target.value);}} required
          style={{width:"100%",border:"1px solid #e2e8f0",borderRadius:10,padding:"11px 14px",fontSize:14,background:"#fff",outline:"none",fontFamily:"inherit",color:"#0f172a",boxSizing:"border-box"}} />
      </div>
      <div style={{marginBottom:20}}>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#0f172a",marginBottom:6}}>Message</label>
        <textarea value={message} onChange={function(e){setMessage(e.target.value);}} required rows={5}
          style={{width:"100%",border:"1px solid #e2e8f0",borderRadius:10,padding:"11px 14px",fontSize:14,background:"#fff",outline:"none",fontFamily:"inherit",color:"#0f172a",resize:"vertical",boxSizing:"border-box"}} />
      </div>
      <button type="submit" disabled={sending}
        style={{background:sending?"#94a3b8":"#0f172a",color:"#fff",border:"none",borderRadius:10,padding:"13px 28px",fontWeight:700,fontSize:15,cursor:sending?"default":"pointer",fontFamily:"inherit"}}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
