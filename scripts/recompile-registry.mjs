/**
 * recompile-registry.mjs — refresh resources/assets.json emojis{} from the LIVE
 * Discord application emoji list. Run after Dev Portal uploads.
 *
 *   node scripts/recompile-registry.mjs
 *   node scripts/recompile-registry.mjs --dry
 *
 * Reads DISCORD_BOT_TOKEN + DISCORD_CLIENT_ID from .env. Preserves every other
 * key (brand, site, socials, logos). Does not rewrite social URLs.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const LIVE = join(here, '..', 'resources', 'assets.json');
const EXAMPLE = join(here, '..', 'resources', 'assets.example.json');
const ASSETS = existsSync(LIVE) ? LIVE : EXAMPLE;
const APP_ID = process.env.DISCORD_CLIENT_ID ?? '';
const TOKEN = process.env.DISCORD_BOT_TOKEN ?? '';
const DRY = process.argv.includes('--dry');

async function liveEmojis() {
  if (!TOKEN) throw new Error('DISCORD_BOT_TOKEN not set');
  if (!APP_ID) throw new Error('DISCORD_CLIENT_ID not set');
  const r = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/emojis`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  if (!r.ok) throw new Error(`emoji list failed: ${r.status} ${await r.text()}`);
  const j = await r.json();
  const m = {};
  (j.items ?? j).forEach((e) => (m[e.name] = { id: e.id, a: !!e.animated }));
  return m;
}

const ref = (e, name) => (e ? `<${e.a ? 'a' : ''}:${name}:${e.id}>` : null);

const main = async () => {
  const m = await liveEmojis();
  const a = JSON.parse(readFileSync(ASSETS, 'utf8'));
  const names = Object.keys(m).sort();
  const emojis = {
    _note: 'AUTO-GENERATED from the live application emoji list. Re-run this script after uploads.',
    _generated: new Date().toISOString().slice(0, 10),
  };
  for (const n of names) emojis[n] = ref(m[n], n);
  a.emojis = emojis;
  if (DRY) {
    console.log(`[leak-safe] would write ${names.length} emoji keys to ${ASSETS}`);
    return;
  }
  writeFileSync(ASSETS, JSON.stringify(a, null, 2) + '\n');
  console.log(`[bot-seed] wrote ${names.length} emoji keys → ${ASSETS}`);
};

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
