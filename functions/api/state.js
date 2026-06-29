// GET /api/state  ->  { colors: [...], claimed: ["Red", ...] }
const COLORS = [
  { name: "Red",    hex: "#EF4444" },
  { name: "Blue",   hex: "#3B82F6" },
  { name: "Pink",   hex: "#EC4899" },
  { name: "Orange", hex: "#FB923C" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Green",  hex: "#22C55E" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Brown",  hex: "#6F4E37" },
  { name: "Black",  hex: "#1A1A1F" },
  { name: "White",  hex: "#FFFFFF" },
];

export async function onRequestGet(context) {
  const { env } = context;
  const raw = await env.COLORS_KV.get("claims");
  const claims = raw ? JSON.parse(raw) : [];
  return json({ colors: COLORS, claimed: claims.map(c => c.color) });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
