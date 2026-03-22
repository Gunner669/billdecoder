export const runtime = "nodejs";

export async function GET() {
  try {
    var { kv } = await import("@vercel/kv");
    var count = await kv.get("bill_count");
    return Response.json({ count: count || 0 }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" }
    });
  } catch(e) {
    return Response.json({ count: 0 });
  }
}
