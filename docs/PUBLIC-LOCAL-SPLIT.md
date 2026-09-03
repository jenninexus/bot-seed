# Public vs local — Bot Seed

Tracked files are clone-safe examples. Tokens, filled greeting copy, and real
desk URLs stay gitignored.

## Track public

| Surface | Path |
|---------|------|
| Pitch | `README.md` · `docs/PRODUCT.md` · `docs/GETTING-STARTED.md` |
| Agent map | `AGENTS.md` |
| Workspace | `bot-seed.code-workspace` (optional sibling folders) |
| Embed rules | `docs/STYLE-SPEC.md` |
| Example tokens | `profiles/discord-bot.example.json` |
| Example content | `content/greeting.md.example` |
| Example registries | `resources/*.example.json` |
| Env **names** | `.env.example` |
| Runtime | `src/` (greeter, wave, slash, optional loft) |

## Keep local

| Surface | Path |
|---------|------|
| Bot token | `.env` |
| Live greeting | `content/greeting.md` |
| Live assets / desks | `resources/assets.json` · `resources/agency-profiles.json` |
| `node_modules` | install locally |

## Product surfaces

```
PUBLIC  — starter (examples + sanitized src/)
PRIVATE — your token, your server IDs, your HTTPS art
PAID    — not planned (tip only)
```

Live production bots are **not** overlays of this repo. They are separate private apps.
