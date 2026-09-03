---
description: >-
  Operate this clone's Discord Gateway bot — greeter, slash skeleton, optional
  loft faces. Use when editing greeting.md, slash commands, Dev Portal intents,
  or loft webhook faces. Webhooks, previewers, and platform watchers are not
  this repo.
---

# Discord Ops (bot-seed)

Thin Gateway runbook for this clone. Product thesis: see [`docs/PRODUCT.md`](../../docs/PRODUCT.md).

**Boundary:** webhooks **send**, bots **react**. Announcement sends, Patreon
receivers, TikTok/YouTube watchers, and embed previewers live in the **Socials**
product — do not add them here. Do not copy Socials `discord-ops` into this tree.

## Greeter

- Copy: `content/greeting.md` (start from `content/greeting.md.example`)
- Wave aggregation: 👋 button, 24h disable
- `FORCE_GREETER=1` (or production `BOT_ENV`) to send greets while testing

## Slash

- `/help` · `/about` · `/socials` — values from `resources/assets.json`
- After command definition changes: `npm run register`

## Optional loft

- `AGENCY_CHAT=1`
- `DISCORD_WEBHOOK_AGENCY` — webhook username/avatar from `resources/agency-profiles.json`
- Example desks in this seed: **Ink** and **Hue** only

## Dev Portal

- **Server Members Intent** ON (greeter)
- **Message Content Intent** ON only if loft is enabled
- **Interactions Endpoint URL** = blank (Gateway bot, not HTTP interactions)

## APP emoji vs webhook `:name:`

Application emojis (`<:name:id>`) render only when **this bot** posts. Webhooks
degrade them to literal `:name:`. Pin/webhook copy must use guild or unicode emoji.

## Hard rules

- Tracked files stay fictional — no live brand channel IDs
- Default embed bar is Discord blurple
- Theme hex is copy-paste into `assets.json` `embedBar` — no CSS import
