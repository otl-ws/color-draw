# Color Draw — Off Thought Labs

A 7-color spinner. Each person spins once, gets a color + a 4-character code, and
that color is removed from the wheel for everyone else. A "Find my color" page
turns a code back into a color.

The shared pool lives in **Cloudflare Workers KV** so it's the same for all 7 people.

## Files
- `index.html` — the page everyone sees
- `functions/api/state.js`  — GET: colors + which are claimed
- `functions/api/claim.js`  — POST: claim a color, get a code
- `functions/api/lookup.js` — GET: look up a color by code
- `functions/api/reset.js`  — POST: clear all draws (needs RESET_KEY)
- `wrangler.toml` — only needed for the CLI route

## Deploy with GitHub (recommended — matches your existing workflow)

1. Push this folder to a new GitHub repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: **Framework preset: None**, **Build command: (leave empty)**,
   **Build output directory: `/`**. Click **Save and Deploy**.
4. Create the storage: **Storage & Databases → KV → Create namespace**, name it `color-draw`.
5. Bind it to the site: your Pages project → **Settings → Bindings → Add → KV namespace**.
   - **Variable name:** `COLORS_KV`  ← must be exactly this
   - **KV namespace:** the one you just made
6. (Optional) Enable the reset button: **Settings → Variables and Secrets → Add**,
   name `RESET_KEY`, value = any password you choose.
7. **Redeploy** (Deployments → ⋯ → Retry deployment) so the binding takes effect.
8. Open your `*.pages.dev` URL. Share that URL with the 7 people.

## Deploy with the CLI (alternative)
```
npm install -g wrangler
npx wrangler kv namespace create COLORS_KV   # paste the id into wrangler.toml
npx wrangler pages deploy .
npx wrangler pages secret put RESET_KEY      # optional, for the reset button
```

## Notes
- Change the colors in BOTH `functions/api/state.js` and `functions/api/claim.js`.
- "One spin per person" is remembered in the browser. Clearing site data lets
  someone spin again if colors remain — fine for a small trusted group.
