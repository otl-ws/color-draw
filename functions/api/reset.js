// POST /api/reset?key=YOUR_KEY  ->  clears every draw.
// Protected by the RESET_KEY environment variable so only you can wipe it.
export async function onRequestPost(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";

  if (!env.RESET_KEY) {
    return json({ error: "Reset is disabled. Add a RESET_KEY environment variable to enable it." }, 403);
  }
  if (key !== env.RESET_KEY) {
    return json({ error: "Wrong reset key." }, 403);
  }

  await env.COLORS_KV.put("claims", JSON.stringify([]));
  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
