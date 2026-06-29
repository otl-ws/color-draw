// POST /api/claim  ->  { code, color }   (or 409 if none left)
const COLORS = [
  { name: "Red",    hex: "#EF4444" },
  { name: "Blue",   hex: "#3B82F6" },
  { name: "Pink",   hex: "#EC4899" },
  { name: "Orange", hex: "#FB923C" },
  { name: "Yellow", hex: "#fffc4f" },
  { name: "Green",  hex: "#22C55E" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Brown",  hex: "#6F4E37" },
  { name: "Black",  hex: "#1A1A1F" },
  { name: "White",  hex: "#FFFFFF" },
  { name: "Gold",  hex: "#c2c05d" },
];
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function onRequestPost(context) {
  const { env } = context;
  const raw = await env.COLORS_KV.get("claims");
  const claims = raw ? JSON.parse(raw) : [];

  const taken = new Set(claims.map(c => c.color));
  const remaining = COLORS.filter(c => !taken.has(c.name));
  if (remaining.length === 0) {
    return json({ error: "Every color has been claimed." }, 409);
  }

  const pick = remaining[Math.floor(Math.random() * remaining.length)];

  const usedCodes = new Set(claims.map(c => c.code));
  let code;
  do { code = randomCode(); } while (usedCodes.has(code));

  claims.push({ code, color: pick.name });
  await env.COLORS_KV.put("claims", JSON.stringify(claims));

  return json({ code, color: pick.name });
}

function randomCode() {
  let c = "";
  for (let i = 0; i < 4; i++) c += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return c;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
