# Embed style (clone-safe)

Discord has **no CSS**. One integer `color` is a left bar. No gradients on the bar.

## Default seed (neutral)

| Token | Value |
|-------|--------|
| embedBar | `#5865F2` (Discord blurple) |
| embedBarInt | `5793266` |
| thumbnail | 1×1 mark, top-right |
| image | 16×9 hero when you have one |
| footer | short brand · context (footers cannot contain markdown links) |

Replace the bar with your brand hex. Convert: `parseInt("FF6B00", 16)` → `16739072`.
Author colors in [theme-designer](https://github.com/jenninexus/theme-designer), then **copy**
`--brand-accent` here. See theme-designer `docs/DISCORD-EMBED.md`.

## Anatomy rules (from production use)

1. Pings (`<@id>`) go in message `content`, not inside the embed.
2. Links go in `description` / fields (`[text](url)`).
3. One custom emoji in the title at most.
4. Never brown / mustard chrome.
5. Deploy image URLs and confirm HTTP 200 **before** send — Discord caches 404s.

Machine example: [`../profiles/discord-bot.example.json`](../profiles/discord-bot.example.json).
