/**
 * Optional loft — keyword chat as webhook desk faces (Ink / Hue in the example).
 *
 * Off unless AGENCY_CHAT=1. Needs Message Content Intent in Dev Portal.
 * Faces: DISCORD_WEBHOOK_AGENCY + AGENCY_WEBHOOK_FACES (default on when URL is set).
 * Replies come from chatVoice.sampleReplies. No live brand desks.
 */
import { readFileSync } from 'node:fs';
import type { APIEmbed, Message } from 'discord.js';
import { resolveData } from './paths.js';

export type DeskProfile = {
  id: string;
  displayName: string;
  webhookUsername: string;
  role: string;
  accent?: string;
  accentInt?: number;
  avatarUrl: string;
  bannerUrl?: string;
  domainKeywords?: string[];
  chatVoice?: {
    tone?: string;
    catchphrase?: string;
    signoff?: string;
    sampleReplies?: string[];
    summonIntros?: string[];
  };
};

type CatalogueFile = {
  hosted?: string;
  sharedStudioVoice?: { cooldownSeconds?: number; maxAgentTurnsPerHuman?: number };
  runtime?: { defaultDesk?: string };
  profiles: DeskProfile[];
};

export type LoftCatalogue = {
  sharedStudioVoice: { cooldownSeconds: number; maxAgentTurnsPerHuman: number };
  runtime: { defaultDesk: string };
  profiles: DeskProfile[];
};

const lastReplyAt = new Map<string, number>();
const turnsThisMsg = new Map<string, number>();
let cache: LoftCatalogue | null = null;

function loadCatalogue(): LoftCatalogue {
  if (cache) return cache;
  const raw = JSON.parse(
    readFileSync(resolveData('resources/agency-profiles.json', 'resources/agency-profiles.example.json'), 'utf8'),
  ) as CatalogueFile;
  const profiles = (Array.isArray(raw.profiles) ? raw.profiles : []).map((p) => ({
    ...p,
    displayName: p.displayName || p.webhookUsername || p.id,
  }));
  cache = {
    sharedStudioVoice: {
      cooldownSeconds: raw.sharedStudioVoice?.cooldownSeconds ?? 8,
      maxAgentTurnsPerHuman: raw.sharedStudioVoice?.maxAgentTurnsPerHuman ?? 2,
    },
    runtime: { defaultDesk: (raw.runtime?.defaultDesk ?? 'ink').toLowerCase() },
    profiles,
  };
  return cache;
}

export function loftChannelId(): string {
  return (process.env.AGENCY_CHANNEL_ID ?? '').trim();
}

export function agencyChatEnabled(): boolean {
  const v = (process.env.AGENCY_CHAT ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'on';
}

export function agencyWebhookUrl(): string {
  return (process.env.DISCORD_WEBHOOK_AGENCY ?? '').trim();
}

export function webhookFacesEnabled(): boolean {
  const v = (process.env.AGENCY_WEBHOOK_FACES ?? '').trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'off') return false;
  if (v === '1' || v === 'true' || v === 'on') return true;
  return Boolean(agencyWebhookUrl());
}

export function defaultDesk(): DeskProfile {
  const cat = loadCatalogue();
  return (
    cat.profiles.find((p) => p.id === cat.runtime.defaultDesk) ??
    cat.profiles[0]
  );
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pickReply(agent: DeskProfile, text: string): string {
  const voice = agent.chatVoice;
  const bareSummon =
    !!text.trim().match(new RegExp(`^[@/]?(?:${escapeRe(agent.displayName)}|${escapeRe(agent.id)})\\b`, 'i')) &&
    text.trim().split(/\s+/).length <= 2;
  if (bareSummon && voice?.summonIntros?.length) {
    return voice.summonIntros[Math.floor(Math.random() * voice.summonIntros.length)];
  }
  const samples = voice?.sampleReplies ?? [];
  if (samples.length) return samples[Math.floor(Math.random() * samples.length)];
  return voice?.catchphrase ?? `${agent.displayName} here — say more.`;
}

function isBait(text: string): boolean {
  const t = text.trim();
  if (t.length < 1) return true;
  if (/^[@/]?[a-z][\w-]{2,20}$/i.test(t)) return false;
  if (t.length < 2) return true;
  if (/^(lol|lmao|haha|ok|k|nice|cool)+$/i.test(t)) return true;
  if (/token|webhook|api[_ -]?key|\.env|password/i.test(t)) return true;
  return false;
}

function isExplicitSummon(text: string): boolean {
  return loadCatalogue().profiles.some((agent) => {
    const name = agent.displayName.toLowerCase();
    const id = agent.id.toLowerCase();
    return (
      new RegExp(`(?:^|[\\s([{])[@/](?:${escapeRe(name)}|${escapeRe(id)})\\b`, 'i').test(text) ||
      new RegExp(`^(?:${escapeRe(name)}|${escapeRe(id)})\\b`, 'i').test(text.trim())
    );
  });
}

function resolveAgent(text: string): DeskProfile {
  const cat = loadCatalogue();
  const lower = text.toLowerCase();
  for (const agent of cat.profiles) {
    const name = agent.displayName.toLowerCase();
    const id = agent.id.toLowerCase();
    if (new RegExp(`(?:^|[\\s([{])[@/]?(?:${escapeRe(name)}|${escapeRe(id)})\\b`, 'i').test(text)) {
      return agent;
    }
  }
  for (const agent of cat.profiles) {
    if (
      new RegExp(`\\b${escapeRe(agent.displayName)}\\b`, 'i').test(lower) ||
      new RegExp(`\\b${escapeRe(agent.id)}\\b`, 'i').test(lower)
    ) {
      return agent;
    }
  }
  let best: DeskProfile | null = null;
  let bestHits = 0;
  for (const agent of cat.profiles) {
    const hits = (agent.domainKeywords ?? []).filter((k) => lower.includes(k.toLowerCase())).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = agent;
    }
  }
  return best ?? defaultDesk();
}

export type LoftWebhookPayload = {
  content?: string | null;
  embeds?: APIEmbed[];
  replyTo?: string;
};

async function postAsDesk(agent: DeskProfile, payload: LoftWebhookPayload): Promise<boolean> {
  const url = agencyWebhookUrl();
  if (!url) return false;
  const body: Record<string, unknown> = {
    username: agent.webhookUsername || agent.displayName,
    avatar_url: agent.avatarUrl,
    allowed_mentions: { parse: [] },
  };
  if (payload.content) body.content = payload.content;
  if (payload.embeds?.length) body.embeds = payload.embeds;
  if (payload.replyTo) body.message_reference = { message_id: payload.replyTo };

  const res = await fetch(`${url}?wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) return true;
  if (payload.replyTo && res.status === 400) {
    delete body.message_reference;
    const r2 = await fetch(`${url}?wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return r2.ok;
  }
  return false;
}

async function deliver(message: Message, agent: DeskProfile, body: string): Promise<void> {
  if (webhookFacesEnabled()) {
    const ok = await postAsDesk(agent, { content: body, replyTo: message.id });
    if (ok) return;
  }
  await message.reply({
    content: `**${agent.displayName}** — ${body}`,
    allowedMentions: { parse: [] },
  });
}

/** Handle one MessageCreate. Returns true if handled. */
export async function handleLoftMessage(message: Message): Promise<boolean> {
  const channelId = loftChannelId();
  if (!channelId || message.channelId !== channelId) return false;
  if (message.author.bot || message.webhookId) return false;
  if (!message.guild) return false;

  const text = message.content?.trim() ?? '';
  if (isBait(text)) return false;

  if (/token|webhook url|api[_ -]?key|private url/i.test(text)) {
    await deliver(message, defaultDesk(), "Keep tokens offline. Ask about the desk work instead.");
    return true;
  }

  const cat = loadCatalogue();
  const coolMs = cat.sharedStudioVoice.cooldownSeconds * 1000;
  const last = lastReplyAt.get(message.author.id) ?? 0;
  if (!isExplicitSummon(text) && Date.now() - last < coolMs) return false;

  const turns = turnsThisMsg.get(message.id) ?? 0;
  if (turns >= cat.sharedStudioVoice.maxAgentTurnsPerHuman) return false;

  const named =
    isExplicitSummon(text) ||
    cat.profiles.some((a) => {
      return (
        new RegExp(`\\b${escapeRe(a.displayName)}\\b`, 'i').test(text) ||
        new RegExp(`\\b${escapeRe(a.id)}\\b`, 'i').test(text)
      );
    });
  const keyed = cat.profiles.some((a) =>
    (a.domainKeywords ?? []).some((k) => text.toLowerCase().includes(k.toLowerCase())),
  );
  if (!named && !keyed) return false;

  const agent = resolveAgent(text);
  await deliver(message, agent, pickReply(agent, text));
  lastReplyAt.set(message.author.id, Date.now());
  turnsThisMsg.set(message.id, turns + 1);
  return true;
}
