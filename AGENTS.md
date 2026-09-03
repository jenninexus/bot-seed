# Bot Seed — agent map

Public Discord **Gateway** starter. Vendor-neutral. Read this before copying
anything from `jenni-bot` or `martian-bot` (those trees are private and brand-full).

## What this repo owns

- Greeter copy contract (`content/greeting.md`)
- Asset registry shape (`resources/assets.json`)
- Optional loft face catalogue (`resources/agency-profiles.json`)
- Embed anatomy (`docs/STYLE-SPEC.md` + `profiles/discord-bot.example.json`)
- Later: sanitized `src/lib/greeter.ts` + wave button + `/help` `/about` `/socials`

## What this repo does not own

| Need | Go here |
|------|---------|
| Draft Patreon / Discord / X / site sisters | `socials` (private today) |
| Character lore / audit personas | [agency](https://github.com/jenninexus/agency) |
| Which *writing* register | [voice-seed](https://github.com/jenninexus/voice-seed) |
| Dashboard `--dash-*` tokens | [theme-designer](https://github.com/jenninexus/theme-designer) |
| Live JN / MG apps | `jenni-bot` / `martian-bot` — **never clone as the product** |
| Secrets / SSH / MCP hub | not a product dependency |

## Registers (voice-seed)

| Register | Edit |
|----------|------|
| `botGreeter` | `content/greeting.md` |
| `discordVisual` | `docs/STYLE-SPEC.md` + `assets.json` colors |
| `agencyDiscordChat` | `resources/agency-profiles.json` `chatVoice` |

Do not dump résumé voice or Patreon “Hey friends” into the greeter.

## Hard rules

1. Example files stay fictional. No channel snowflakes, webhook URLs, or our site CDN.
2. Copy-don’t-import theme hex. Bots do not load CSS.
3. APP emojis only render when **this bot** posts. Webhooks cannot use them.
4. Image bytes live on **the user’s site HTTPS**, not `/opt/bot-seed/`.
5. `C:\mcp` is network infra, not a clone requirement.

## Related hub

Local packaging notes: `C:\Github\product-design\docs\BOT-SEED.md` (not shipped in this repo).
