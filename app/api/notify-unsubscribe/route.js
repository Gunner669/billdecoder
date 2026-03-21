import { kv } from "@vercel/kv";
import { createHmac } from "crypto";

export const runtime = "nodejs";

function expectedToken(email) {
  var secret = process.env.CRON_SECRET || "billdecoder";
  return createHmac("sha256", secret).update(email).digest("hex").slice(0, 16);
}

export async function GET(request) {
  var url = new URL(request.url);
  var email = (url.searchParams.get("email") || "").trim().toLowerCase();
  var token = url.searchParams.get("token") || "";

  if (!email || !token || token !== expectedToken(email)) {
    return new Response(html("Invalid unsubscribe link."), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  try {
    var raw = await kv.get("notify:" + email);
    if (raw) {
      var record = typeof raw === "string" ? JSON.parse(raw) : raw;
      record.unsubscribed = true;
      await kv.set("notify:" + email, JSON.stringify(record));
    }
    await kv.srem("notify_emails", email);
  } catch(err) {
    console.error("Unsubscribe error:", err.message);
  }

  return new Response(html("You have been unsubscribed. You will not receive any further emails from BillDecoder.au."), { status: 200, headers: { "Content-Type": "text/html" } });
}

function html(message) {
  return '<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe — BillDecoder.au</title></head>'
    + '<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">'
    + '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;max-width:420px;text-align:center">'
    + '<p style="font-weight:700;font-size:18px;color:#0f172a;margin:0 0 12px">BillDecoder.au</p>'
    + '<p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px">' + message + '</p>'
    + '<a href="https://billdecoder.au" style="color:#10b981;font-weight:600;font-size:14px;text-decoration:none">Back to BillDecoder.au</a>'
    + '</div></body></html>';
}
