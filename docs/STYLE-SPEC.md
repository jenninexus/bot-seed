# Embed style (clone-safe)

Discord has **no CSS**. One integer `color` is a left bar. No gradients on the bar.

## Default seed (neutral)

| Token | Value |
|-------|--------|
| embedBar | `#5865F2` (Discord blurple) |
| embedBarInt | `5793266` |
| thumbnail | 1×1 mark, top-right |
| image | 16×9 hero when you have one |
| footer | short brand · context + the command that reproduces the post, e.g. `Type /ink show:pic · Loft` (footers cannot contain markdown links) |

Replace the bar with your brand hex. Convert: `parseInt("FF6B00", 16)` → `16739072`.
Author colors in [theme-designer](https://github.com/jenninexus/theme-designer), then **copy**
`--brand-accent` here. See theme-designer `docs/DISCORD-EMBED.md`.

## Anatomy rules (from production use)

1. Pings (`<@id>`) go in message `content`, not inside the embed.
2. Links go in `description` / fields (`[text](url)`).
3. **One identity icon per embed.** The poster avatar already shows who is speaking; add at most one
   small face/emoji — first thing in the description — and no author icon or title emoji on top of
   it. The top-right thumbnail is a tight 1×1 **face** crop (a full scene reads as a room at 80px).
4. Never brown / mustard chrome.
5. Deploy image URLs and confirm HTTP 200 **before** send — Discord caches 404s.
6. Posting avatars and top-right thumbnails must be square. Keep wide platform wordmarks in an
   author/footer icon or the embed body; Discord crops rectangular avatars into unreadable circles.
7. Use one deliberate 16×9 hero per embed. Multiple full-width embed images can gallery-stack and
   make a compact notification look like several widgets.

Machine example: [`../profiles/discord-bot.example.json`](../profiles/discord-bot.example.json).
