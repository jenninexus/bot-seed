<div align="center">

# Bot Seed

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-14-5865F2?style=flat-square&logo=discord&logoColor=white)
![MIT](https://img.shields.io/badge/license-MIT-00e879?style=flat-square)
![Mode](https://img.shields.io/badge/mode-clone--safe-39ff8c?style=flat-square)

**They joined. You waved. Watchers stay out.** 👋

A small **Discord Gateway** starter: join greeter, 👋 wave button, `/help`
`/about` `/socials`, optional loft faces. Fill the examples, paste *your*
token, greet *your* server.

Not a live production bot. Not a drafting / webhook / TikTok studio.

</div>

---

Clone, copy the examples, invite the app. No droplet, no private theme kit,
no sys-admin.

```bash
git clone https://github.com/jenninexus/bot-seed.git
cd bot-seed
npm install
cp .env.example .env
cp content/greeting.md.example content/greeting.md
cp resources/assets.example.json resources/assets.json
npm run register
npm run bot
```

| Start here | |
|---|---|
| [`docs/GETTING-STARTED.md`](docs/GETTING-STARTED.md) | Copy steps, Dev Portal intents, loft |
| [`docs/STYLE-SPEC.md`](docs/STYLE-SPEC.md) | Flat embed bar, 1×1 thumb, 16×9 hero |
| [`docs/PRODUCT.md`](docs/PRODUCT.md) | Clone promise + tip |
| [`docs/PUBLIC-LOCAL-SPLIT.md`](docs/PUBLIC-LOCAL-SPLIT.md) | What is tracked vs gitignored |
| [`AGENTS.md`](AGENTS.md) | Thin agent map |
| [`bot-seed.code-workspace`](bot-seed.code-workspace) | Open this folder (+ optional public siblings) |

Sister public seeds: [agency](https://github.com/jenninexus/agency) · [voice-seed](https://github.com/jenninexus/voice-seed) · [theme-designer](https://github.com/jenninexus/theme-designer).

Do not submodule those. Copy hex and prose. Do not `@import` a theme kit.

## What you get

| Piece | File |
|-------|------|
| Join greeter + 👋 wave | `src/lib/greeter.ts` · wave aggregate in `src/index.ts` |
| Slash `/help` `/about` `/socials` | `src/commands/` — reads `resources/assets.json` |
| Greeter copy | `content/greeting.md.example` → `content/greeting.md` |
| Brand / links / embed bar | `resources/assets.example.json` |
| Optional desk faces (Ink / Hue) | `resources/agency-profiles.example.json` |
| Discord visual tokens | `profiles/discord-bot.example.json` |

Default embed bar is Discord blurple (`#5865F2`). Replace it with your hex.

## Webhooks vs this bot

Webhooks **send** announcements. This bot **reacts** (joins, slash, optional chat).
Use both if you want drafted posts *and* a greeter — they are different products.
Do not put Patreon / TikTok / X / YouTube watchers in this repo.

MIT — use, fork, customize. See [`LICENSE`](LICENSE).

---

<div align="center">

If this starter helped you greet *your* server: ✨

[Star this repo](https://github.com/jenninexus/bot-seed) · [Patreon](https://www.patreon.com/c/JenniNexus) · [PayPal](https://paypal.me/jenninexus)

Suggested tip **$3 or $5** — same as the other public seeds; it does not unlock extra files.

Made with 💚 by [Jenni](https://github.com/jenninexus) at [Monofinity Studio](https://github.com/monofinitystudio)

</div>
