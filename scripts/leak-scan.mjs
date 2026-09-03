/**
 * leak-scan.mjs — fail if tracked seed files contain live brand IDs or paths.
 * Run before any GitHub create. Does not scan .env or gitignored copies.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'Plans']);
const TEXT_EXT = new Set(['.ts', '.js', '.mjs', '.json', '.md', '.example', '.css', '.html', '']);

const FORBIDDEN = [
  [/jenninexus\.com/i, 'jenninexus.com'],
  [/martiangames\.com/i, 'martiangames.com'],
  [/jennidrop/i, 'jennidrop'],
  [/\/opt\/jenni-bot/i, '/opt/jenni-bot'],
  [/\/opt\/martian-bot/i, '/opt/martian-bot'],
  [/\bVidette\b/, 'Vidette'],
  [/patreonVisualProfiles/, 'patreonVisualProfiles'],
  [/tiktokVisualProfiles/, 'tiktokVisualProfiles'],
  [/xVisualProfiles/, 'xVisualProfiles'],
  [/discord\.com\/api\/webhooks\//i, 'webhook URL'],
  [/C:\\Github\\/i, 'C:\\Github\\ path'],
  [/C:\\Users\\/i, 'C:\\Users\\ path'],
  [/D:\\/i, 'D:\\ path'],
  [/<a?:[a-z0-9_]+:\d{17,19}>/i, 'APP/guild emoji snowflake'],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const hits = [];
for (const file of walk(root)) {
  const rel = relative(root, file).replaceAll('\\', '/');
  if (rel === 'scripts/leak-scan.mjs') continue;
  const ext = extname(file);
  if (!TEXT_EXT.has(ext) && !file.endsWith('.example') && !file.endsWith('.example.json') && !file.endsWith('.example.md')) continue;
  if (!['.ts', '.js', '.mjs', '.json', '.md', '.css', '.html'].includes(ext) && !file.includes('.example')) continue;
  const text = readFileSync(file, 'utf8');
  for (const [re, label] of FORBIDDEN) {
    if (re.test(text)) hits.push(`${rel}: ${label}`);
  }
}

if (hits.length) {
  console.error('[leakcheck] FAIL');
  for (const h of hits) console.error('  ' + h);
  process.exit(1);
}
console.log('[leakcheck] PASS — no live brand IDs in tracked seed files');
