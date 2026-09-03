/**
 * greeter.ts — new-member welcome embed.
 *
 * Parser: optional KEY: fields become embed chrome; the Markdown body is the
 * description. The {user} ping is returned separately (Discord cannot ping
 * inside an embed).
 *
 * Copy: content/greeting.md (falls back to greeting.md.example).
 */
import { readFileSync, existsSync } from 'node:fs';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type GuildMember,
} from 'discord.js';
import { resolveData } from './paths.js';

const GREETING_PATH = resolveData('content/greeting.md', 'content/greeting.md.example');

const FALLBACK = '👋 Welcome, {user}! You are member #{count} of {server}.';
const FIELD_KEYS = [
  'COLOR', 'TITLE', 'THUMBNAIL', 'BANNER', 'FOOTER', 'FOOTER_ICON',
  'AUTHOR', 'AUTHOR_URL', 'AUTHOR_ICON',
] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

interface Greeting { fields: Partial<Record<FieldKey, string>>; body: string; }

function loadGreeting(): Greeting {
  if (!existsSync(GREETING_PATH)) return { fields: {}, body: FALLBACK };
  const raw = readFileSync(GREETING_PATH, 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!raw) return { fields: {}, body: FALLBACK };
  const fields: Partial<Record<FieldKey, string>> = {};
  const lines = raw.split('\n');
  let i = 0;
  for (; i < lines.length; i++) {
    const m = lines[i].match(/^([A-Z_]+):\s*(.*)$/);
    if (!m || !FIELD_KEYS.includes(m[1] as FieldKey)) break;
    fields[m[1] as FieldKey] = m[2].trim();
  }
  return { fields, body: lines.slice(i).join('\n').trim() || FALLBACK };
}

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export interface GreetMessage {
  content: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder<ButtonBuilder>[];
}

/**
 * The "👋 Wave to say hi" button row.
 * customId carries the NEW MEMBER's id so any later click knows who the wave is for.
 * Pass disabled=true to grey it out (the 24h-lifetime edit in index.ts).
 */
export function waveRow(newMemberId: string, disabled = false): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`wave:${newMemberId}`)
      .setLabel('Wave to say hi')
      .setEmoji('👋')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
}

/** Build the welcome message for a joining member. content = the ping (always); embed if fields. */
export function buildGreeting(member: GuildMember): GreetMessage {
  const vars = {
    user: `<@${member.id}>`,
    username: member.user.username,
    count: member.guild.memberCount.toLocaleString('en-US'),
    server: member.guild.name,
    avatar: member.displayAvatarURL({ extension: 'png', size: 256 }),
  };
  const { fields, body } = loadGreeting();
  const description = render(body, vars);

  if (Object.keys(fields).length === 0) {
    return { content: render(`${body}`, vars) };
  }

  const embed = new EmbedBuilder().setDescription(description);
  if (fields.COLOR)     embed.setColor(parseInt(fields.COLOR.replace('#', ''), 16));
  if (fields.AUTHOR)    embed.setAuthor({
    name: render(fields.AUTHOR, vars),
    ...(fields.AUTHOR_URL ? { url: render(fields.AUTHOR_URL, vars) } : {}),
    ...(fields.AUTHOR_ICON ? { iconURL: render(fields.AUTHOR_ICON, vars) } : {}),
  });
  if (fields.TITLE)     embed.setTitle(render(fields.TITLE, vars));
  if (fields.THUMBNAIL) embed.setThumbnail(render(fields.THUMBNAIL, vars));
  if (fields.BANNER)    embed.setImage(render(fields.BANNER, vars));
  if (fields.FOOTER)    embed.setFooter({
    text: render(fields.FOOTER, vars),
    ...(fields.FOOTER_ICON ? { iconURL: render(fields.FOOTER_ICON, vars) } : {}),
  });

  return { content: `<@${member.id}>`, embeds: [embed], components: [waveRow(member.id)] };
}
