// GET /api/lookup?code=XXXX  ->  { code, color }  (or 404)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = (url.searchParams.get("code") || "").toUpperCase().trim();

  if (code.length < 4) return json({ error: "Enter your 4-character code." }, 400);

  const raw = await env.COLORS_KV.get("claims");
  const claims = raw ? JSON.parse(raw) : [];
  const hit = claims.find(c => c.code === code);

  if (!hit) return json({ error: "No color found for that code." }, 404);
  return json({ code, color: hit.color });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
