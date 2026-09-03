# Public vs local — Bot Seed

Tracked files are clone-safe examples. Tokens, filled greeting copy, and real
desk URLs stay gitignored.

## Track public

| Surface | Path |
|---------|------|
| Pitch | `README.md` · `docs/PRODUCT.md` |
| Agent map | `AGENTS.md` |
| Embed rules | `docs/STYLE-SPEC.md` |
| Example tokens | `profiles/discord-bot.example.json` |
| Example content | `content/greeting.md.example` |
| Example registries | `resources/*.example.json` |
| Env **names** | `.env.example` |

## Keep local

| Surface | Path |
|---------|------|
| Bot token | `.env` |
| Live greeting | `content/greeting.md` |
| Live assets / desks | `resources/assets.json` · `resources/agency-profiles.json` |
| `node_modules` | install locally |

## Product surfaces

```
PUBLIC  — starter (examples + later sanitized src/)
PRIVATE — your token, your server IDs, your HTTPS art
PAID    — not planned (tip only)
```

jenni-bot / martian-bot are **not** overlays of this repo. They are separate private apps.
