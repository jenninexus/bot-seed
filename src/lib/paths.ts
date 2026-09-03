/**
 * Resolve live data files, falling back to tracked *.example copies so a
 * fresh clone typechecks and boots without copying first.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const ROOT = root;

export function resolveData(liveRel: string, exampleRel: string): string {
  const live = join(root, liveRel);
  if (existsSync(live)) return live;
  return join(root, exampleRel);
}
