# Bot Seed — agent map

Public Discord **Gateway** starter. Vendor-neutral. Do not copy live brand
apps into this tree.

## What this repo owns

- Greeter copy contract (`content/greeting.md`)
- Asset registry shape (`resources/assets.json`)
- Optional loft face catalogue (`resources/agency-profiles.json`)
- Embed anatomy (`docs/STYLE-SPEC.md` + `profiles/discord-bot.example.json`)
- Runtime: `src/lib/greeter.ts` + wave aggregate in `src/index.ts` + `/help` `/about` `/socials` + optional loft
- Gateway runbook: [`.claude/commands/discord-ops.md`](.claude/commands/discord-ops.md)

## What this repo does not own

| Need | Go here |
|------|---------|
| Draft Patreon / Discord / X / site sisters | Socials (private today; public starter later) |
| Character lore / audit personas | [agency](https://github.com/jenninexus/agency) |
| Which *writing* register | [voice-seed](https://github.com/jenninexus/voice-seed) (public) |
| Dashboard `--dash-*` tokens | [theme-designer](https://github.com/jenninexus/theme-designer) |
| Live production apps | stay private — never clone those as the product |
| Secrets / SSH / MCP hub | not a product dependency |

## Registers (voice-seed)

| Register | Edit |
|----------|------|
| `botGreeter` | `content/greeting.md` |
| `discordVisual` | `docs/STYLE-SPEC.md` + `assets.json` colors |
| `agencyDiscordChat` | `resources/agency-profiles.json` `chatVoice` |

Do not dump résumé voice or Patreon “Hey friends” into the greeter.

## Hard rules

1. Example files stay fictional. No channel snowflakes, webhook URLs, or live site CDN.
2. Copy-don’t-import theme hex. Bots do not load CSS.
3. APP emojis only render when **this bot** posts. Webhooks cannot use them.
4. Image bytes live on **the user’s site HTTPS**, not `/opt/bot-seed/`.
5. Network admin tooling is not a clone requirement.
6. Default embed bar is Discord blurple. Example desks are Ink and Hue only.
7. README tip footer stays Patreon + PayPal + `github.com/jenninexus` — never `jenninexus.com` (leakcheck).

## Related hub

Packaging, store board, and GitHub-visibility sequence are **not** this repo.
On studio machines they live in the local **product-design** hub (`/products` ·
`product-design/docs/SEED-FAMILY.md` · `product-design/docs/BOT-SEED.md`). Do not copy that sequence plan here.
`jenninexus/bot-seed` is the public seed. Re-run `npm run leakcheck` before every push.
Do not copy live brand apps into this tree.
