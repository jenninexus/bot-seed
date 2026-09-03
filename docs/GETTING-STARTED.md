# Getting started

A stranger can greet members in *their* Discord without our droplets or theme kits.

## 1. Copy the examples

```bash
npm install
cp .env.example .env
cp content/greeting.md.example content/greeting.md
cp resources/assets.example.json resources/assets.json
# optional loft faces:
cp resources/agency-profiles.example.json resources/agency-profiles.json
```

Paste a **Bot** token into `.env` (`DISCORD_BOT_TOKEN`). Set `DISCORD_CLIENT_ID`
from the Dev Portal application. `DISCORD_GUILD_ID` makes slash commands appear
instantly on that server.

Filled copies are gitignored. See [`PUBLIC-LOCAL-SPLIT.md`](PUBLIC-LOCAL-SPLIT.md).

## 2. Dev Portal (Gateway bot)

1. **Server Members Intent** ON — greeter.
2. **Message Content Intent** ON only if you enable loft (`AGENCY_CHAT=1`).
3. **Interactions Endpoint URL** = blank. Do not paste a URL here.
4. Invite with scopes `bot` + `applications.commands`.
   Permissions: Send Messages, Embed Links, Read Message History, View Channels.

## 3. Register and run

```bash
npm run register
# greeter stays off until:
#   BOT_ENV=production   or   FORCE_GREETER=1
# plus WELCOME_CHANNEL_ID
npm run bot
```

Optional loft: `AGENCY_CHAT=1`, `AGENCY_CHANNEL_ID`, and
`DISCORD_WEBHOOK_AGENCY` (channel Integrations → Webhooks). Example desks are
**Ink** and **Hue** only.

After you upload **application** emojis: `npm run recompile` (writes live
`emojis{}` into `resources/assets.json`). Never commit snowflakes in the
example file.

## 4. Paint the bar

Default `embedBar` is Discord blurple (`#5865F2`). Copy `--brand-accent` from
[theme-designer](https://github.com/jenninexus/theme-designer) `docs/DISCORD-EMBED.md`
into `resources/assets.json`. Bots do not load CSS.

## Optional siblings (never required)

| Clone beside this repo | Use |
|------------------------|-----|
| [agency](https://github.com/jenninexus/agency) | Staff fictional desks (lore) |
| [voice-seed](https://github.com/jenninexus/voice-seed) | Route `botGreeter` / `agencyDiscordChat` |
| [theme-designer](https://github.com/jenninexus/theme-designer) | Pick `--brand-accent` → `embedBar` |

Open [`../bot-seed.code-workspace`](../bot-seed.code-workspace) if you cloned
those next door. Missing sibling folders are fine — this seed runs alone.

Do not add them as git submodules. Do not `@import` a private theme kit.

## Folder map

| Path | Role |
|------|------|
| `content/greeting.md` | Join copy (`botGreeter`) |
| `resources/assets.json` | Brand hex, links, optional APP emoji |
| `resources/agency-profiles.json` | Optional loft faces |
| `src/lib/greeter.ts` | Parser + 👋 wave row |
| `src/index.ts` | Login, slash router, wave aggregate |
| `src/commands/` | `/help` `/about` `/socials` |
| `docs/STYLE-SPEC.md` | Embed anatomy |

## Verify

```bash
npm run typecheck
npm run leakcheck
```

`leakcheck` must stay green before you push a fork that still uses this seed's
example files.
