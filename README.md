# Bot Seed

Clone-safe **Discord community bot starter**. Fill the examples, add *your* token,
greet members, ship slash commands. Optional Agency loft faces.

This is **not** JenniNexus or Martian Games’ live bots. Those stay private.
This is **not** a social drafting kit — that is [jenninexus/socials](https://github.com/jenninexus/socials)
(still private; public starter later).

## What you get

| Piece | File |
|-------|------|
| Join greeter copy | `content/greeting.md.example` → `content/greeting.md` |
| Brand / links / embed bar | `resources/assets.example.json` |
| Optional desk faces | `resources/agency-profiles.example.json` |
| Discord visual tokens | `profiles/discord-bot.example.json` |
| Embed rules | [`docs/STYLE-SPEC.md`](docs/STYLE-SPEC.md) |

Runtime TypeScript (greeter parser, 👋 wave button, slash skeleton) lands after a
sanitized extract from our private twins. The **contract** is already here so Agency,
Voice Seed, and Theme Designer can point at one shape.

## Pair with (optional — never required)

| Clone | Why |
|-------|-----|
| [jenninexus/agency](https://github.com/jenninexus/agency) | Staff fictional desks (lore) |
| [jenninexus/voice-seed](https://github.com/jenninexus/voice-seed) | Route `botGreeter` / `agencyDiscordChat` (public soon) |
| [jenninexus/theme-designer](https://github.com/jenninexus/theme-designer) | Pick `--brand-accent` → copy into `assets.json` `embedBar` |

Do not submodule those repos. Copy hex and prose. Do not `@import` private theme kits.

## Quick start (when runtime lands)

1. Copy `.env.example` → `.env` and paste a **Bot** token (Dev Portal → Bot → Reset Token).
2. Enable **Server Members Intent**. Leave Interactions Endpoint URL blank.
3. Copy `content/greeting.md.example` → `content/greeting.md` and edit the body.
4. Copy `resources/assets.example.json` → `resources/assets.json` and set your hex + URLs.
5. Invite with scopes `bot` + `applications.commands`.

Until `src/` exists, this folder is the **product contract + examples**.

## Webhooks vs this bot

Webhooks **send** announcements. This bot **reacts** (joins, slash, optional chat).
Use both if you want drafted posts *and* a greeter — they are different products.

## License

MIT. If this helped: [Patreon](https://www.patreon.com/c/JenniNexus) · [PayPal](https://paypal.me/jenninexus)
