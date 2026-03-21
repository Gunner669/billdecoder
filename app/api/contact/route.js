import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function isValidEmail(str) {
  if (typeof str !== "string") return false;
  var trimmed = str.trim().toLowerCase();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export async function POST(request) {
  var body;
  try { body = await request.json(); }
  catch(e) { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  var name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  var email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  var message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

  if (!name) return Response.json({ error: "Name is required." }, { status: 400 });
  if (!isValidEmail(email)) return Response.json({ error: "Valid email is required." }, { status: 400 });
  if (!message) return Response.json({ error: "Message is required." }, { status: 400 });

  var record = {
    name: name,
    email: email,
    message: message,
    submittedAt: new Date().toISOString()
  };

  try {
    await kv.lpush("contact_messages", JSON.stringify(record));
    return Response.json({ ok: true });
  } catch(err) {
    console.error("KV error:", err.message);
    return Response.json({ error: "Could not send message." }, { status: 500 });
  }
}
