import { kv } from "@vercel/kv";
import { Resend } from "resend";
import { createHmac } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

var SAVINGS_THRESHOLD = 150;
var IMPROVEMENT_THRESHOLD = 100;
var FALLBACK_DAYS = 30;

function isAuthorized(request) {
  var secret = process.env.CRON_SECRET;
  if (!secret) return false;
  var auth = request.headers.get("authorization");
  if (auth === "Bearer " + secret) return true;
  var url = new URL(request.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

function unsubscribeToken(email) {
  var secret = process.env.CRON_SECRET || "billdecoder";
  return createHmac("sha256", secret).update(email).digest("hex").slice(0, 16);
}

function buildEmailHtml(record, currentDeal) {
  var savings = record.userAnnualCost - currentDeal.bestDealAnnualCost;
  var savingsStr = "$" + Math.round(savings).toLocaleString();
  var costStr = "$" + Math.round(record.userAnnualCost).toLocaleString();
  var date = record.subscribedAt ? new Date(record.subscribedAt).toLocaleDateString("en-AU", {year:"numeric",month:"long",day:"numeric"}) : "recently";
  var unsub = "https://billdecoder.au/api/notify-unsubscribe?email=" + encodeURIComponent(record.email) + "&token=" + unsubscribeToken(record.email);

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
    + '<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,sans-serif">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px"><tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">'
    // Header
    + '<tr><td style="background:#0f172a;padding:20px 24px">'
    + '<table cellpadding="0" cellspacing="0"><tr>'
    + '<td style="background:#10b981;border-radius:8px;width:30px;height:30px;text-align:center;vertical-align:middle">'
    + '<span style="color:#fff;font-size:16px">&#9889;</span></td>'
    + '<td style="padding-left:10px;color:#fff;font-weight:800;font-size:17px">BillDecoder<span style="color:#10b981">.au</span></td>'
    + '</tr></table></td></tr>'
    // Body
    + '<tr><td style="padding:32px 28px">'
    + '<p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 16px">'
    + 'When you analysed your electricity bill on BillDecoder.au on ' + date + ', your estimated annual cost was <strong>' + costStr + '/year</strong>.</p>'
    + '<div style="background:#f0fdf4;border:2px solid #86efac;border-radius:14px;padding:20px 22px;margin:0 0 20px">'
    + '<p style="font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px">Better deal found in ' + record.state + '</p>'
    + '<p style="font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;margin:0 0 6px">Save ~' + savingsStr + '/year</p>'
    + '<p style="font-size:14px;color:#166534;line-height:1.6;margin:0">' + (currentDeal.note || 'Updated market offers are now available in your state.') + '</p>'
    + '</div>'
    + '<p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px">We recommend checking the latest plans to see if switching makes sense for you.</p>'
    // CTA buttons
    + '<table cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr>'
    + '<td style="background:#0f172a;border-radius:10px;padding:13px 24px"><a href="https://www.energymadeeasy.gov.au" style="color:#fff;text-decoration:none;font-weight:700;font-size:14px">Compare plans on Energy Made Easy</a></td>'
    + '<td width="10"></td>'
    + '<td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:13px 24px"><a href="https://billdecoder.au" style="color:#0f172a;text-decoration:none;font-weight:700;font-size:14px">Re-analyse your bill</a></td>'
    + '</tr></table>'
    + '<p style="font-size:12px;color:#94a3b8;line-height:1.6;margin:0">Energy Made Easy is the Australian Government\'s free comparison tool. BillDecoder.au is independent and does not receive commissions from any retailer.</p>'
    + '</td></tr>'
    // Footer
    + '<tr><td style="border-top:1px solid #e2e8f0;padding:18px 28px;background:#f8fafc">'
    + '<p style="font-size:11px;color:#94a3b8;line-height:1.6;margin:0">'
    + 'You requested this one-time notification on ' + date + '. This is the only email we will send. '
    + '<a href="' + unsub + '" style="color:#94a3b8">Unsubscribe</a></p>'
    + '</td></tr>'
    + '</table></td></tr></table></body></html>';
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  var resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return Response.json({ error: "RESEND_API_KEY not configured." }, { status: 500 });
  }

  var resend = new Resend(resendKey);
  var emails;
  try {
    emails = await kv.smembers("notify_emails");
  } catch(err) {
    console.error("KV error fetching emails:", err.message);
    return Response.json({ error: "Could not fetch subscribers." }, { status: 500 });
  }

  if (!emails || emails.length === 0) {
    return Response.json({ processed: 0, sent: 0, skipped: 0 });
  }

  var sent = 0;
  var skipped = 0;
  var errors = 0;

  for (var i = 0; i < emails.length; i++) {
    var email = emails[i];
    try {
      var raw = await kv.get("notify:" + email);
      if (!raw) { skipped++; continue; }
      var record = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (record.notifiedAt) { skipped++; continue; }
      if (record.unsubscribed) { skipped++; continue; }

      var dealKey = "deal_updates:" + record.state;
      var dealRaw = await kv.get(dealKey);
      var currentDeal = dealRaw ? (typeof dealRaw === "string" ? JSON.parse(dealRaw) : dealRaw) : null;

      var shouldSend = false;

      if (currentDeal && typeof record.userAnnualCost === "number" && typeof currentDeal.bestDealAnnualCost === "number") {
        var savingsVsCurrent = record.userAnnualCost - currentDeal.bestDealAnnualCost;
        var savingsVsSignup = (record.bestDealAnnualCost || record.userAnnualCost) - currentDeal.bestDealAnnualCost;
        if (savingsVsCurrent >= SAVINGS_THRESHOLD && savingsVsSignup >= IMPROVEMENT_THRESHOLD) {
          shouldSend = true;
        }
      }

      if (!shouldSend && record.verdict === "overcharged" && record.subscribedAt) {
        var daysSince = (Date.now() - new Date(record.subscribedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince >= FALLBACK_DAYS) {
          shouldSend = true;
          if (!currentDeal) {
            currentDeal = { bestDealAnnualCost: Math.round(record.userAnnualCost * 0.8), note: "Market offers may have improved since you last checked." };
          }
        }
      }

      if (!shouldSend) { skipped++; continue; }

      await resend.emails.send({
        from: "BillDecoder.au <notify@billdecoder.au>",
        to: record.email,
        subject: "A better electricity deal is now available in " + record.state,
        html: buildEmailHtml(record, currentDeal)
      });

      record.notifiedAt = new Date().toISOString();
      await kv.set("notify:" + email, JSON.stringify(record));
      sent++;
    } catch(err) {
      console.error("Error processing " + email + ":", err.message);
      errors++;
    }
  }

  return Response.json({ processed: emails.length, sent: sent, skipped: skipped, errors: errors });
}
