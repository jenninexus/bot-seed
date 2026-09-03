/**
 * assets.ts — load resources/assets.json (logo, color, site, socials).
 * One read at startup. Falls back to assets.example.json on a fresh clone.
 *
 * Unicode emoji in social rows. APP snowflakes are optional and must never
 * ship as this seed's defaults (webhooks cannot render APP glyphs anyway).
 */
import { readFileSync } from 'node:fs';
import { resolveData } from './paths.js';

export interface Social { label: string; emoji: string; url: string; handle: string; }

interface Assets {
  brand?: { name?: string; url?: string; embedBar?: string; embedBarInt?: number };
  site?: string;
  colors?: { embedBar?: string };
  logos?: { icon1x1?: string; authorIcon?: string };
  socials?: Record<string, Social | string>;
  emojis?: Record<string, string>;
}

const BLURPLE = '#5865F2';
const EXAMPLE_SITE = 'https://example.com';

let cache: Assets | null = null;

function load(): Assets {
  if (cache) return cache;
  const raw = readFileSync(resolveData('resources/assets.json', 'resources/assets.example.json'), 'utf8');
  cache = JSON.parse(raw) as Assets;
  return cache;
}

export const BRAND_NAME = (): string => load().brand?.name ?? 'Your Community';
export const SITE_URL = (): string => load().site ?? load().brand?.url ?? EXAMPLE_SITE;
export const LOGO_1x1 = (): string =>
  load().logos?.icon1x1 ?? load().logos?.authorIcon ?? `${EXAMPLE_SITE}/logo-1x1.png`;

/** Flat embed accent bar — Discord blurple unless the clone sets embedBar. */
export const EMBED_BAR = (): number => {
  const hex = load().colors?.embedBar ?? load().brand?.embedBar ?? BLURPLE;
  return parseInt(hex.replace('#', ''), 16);
};

export const hexColor = (hex: string): number => parseInt(hex.replace('#', ''), 16);

/**
 * Optional APP emoji token from the registry, else unicode fallback.
 * Do not put live snowflakes in the example file.
 */
export function appEmoji(key: string, fallback = ''): string {
  const value = load().emojis?.[key];
  return typeof value === 'string' && value.startsWith('<') ? value : fallback;
}

/** Social accounts in registry order, skipping `_` keys and string placeholders. */
export function socials(): Social[] {
  const s = load().socials ?? {};
  return Object.entries(s)
    .filter(([k, v]) => !k.startsWith('_') && typeof v === 'object' && v !== null)
    .map(([, v]) => v as Social);
}
