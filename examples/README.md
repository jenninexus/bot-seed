# Example files

| File | Copy to | Purpose |
|------|---------|---------|
| `.env.example` | `.env` | Token **names** only |
| `content/greeting.md.example` | `content/greeting.md` | Greeter prose (`botGreeter`) |
| `resources/assets.example.json` | `resources/assets.json` | Brand hex + links |
| `resources/agency-profiles.example.json` | `resources/agency-profiles.json` | Optional loft faces (Ink / Hue) |
| `src/` | (run as-is) | Greeter, wave, `/help` `/about` `/socials` |
| `scripts/recompile-registry.mjs` | `npm run recompile` | Refresh `emojis{}` from *your* Dev Portal uploads |
| `profiles/discord-bot.example.json` | (reference) | Embed bar defaults; copy hex into assets |

Filled copies are gitignored. No JenniNexus or Martian Games IDs belong in this tree.

Open [`../bot-seed.code-workspace`](../bot-seed.code-workspace) from this repo root.
Sibling folders (`agency`, `voice-seed`, `theme-designer`) appear if you cloned
those public seeds next door. This seed runs fine without them.
