/**
 * bot-seed — Discord.js community starter.
 *
 * Slash: /help /about /socials (from resources/assets.json).
 * Greeter: guildMemberAdd + 👋 wave aggregate (24h).
 * Optional loft: AGENCY_CHAT=1 → keyword replies as webhook desk faces.
 *
 * Webhooks SEND; this bot REACTS. Patreon / TikTok / X / YouTube watchers
 * belong in a drafting kit (Socials), not here.
 */
import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Collection,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

import * as help from './commands/help.js';
import * as about from './commands/about.js';
import * as socials from './commands/socials.js';
import { buildGreeting, waveRow } from './lib/greeter.js';
import { agencyChatEnabled, handleLoftMessage, loftChannelId, webhookFacesEnabled } from './lib/loft.js';

interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (i: ChatInputCommandInteraction) => Promise<void>;
}

const COMMANDS: Command[] = [help, about, socials];

const TOKEN = process.env.DISCORD_BOT_TOKEN ?? '';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? '';
const GUILD_ID = process.env.DISCORD_GUILD_ID ?? '';
const WELCOME_CHANNEL = process.env.WELCOME_CHANNEL_ID ?? '';

const GREETER_ON =
  Boolean(WELCOME_CHANNEL) &&
  (process.env.BOT_ENV === 'production' || process.env.FORCE_GREETER === '1');

interface WaveState { wavers: Map<string, string>; waveMessageId?: string }
const waves = new Map<string, WaveState>();
const WAVE_LIFETIME_MS = 24 * 60 * 60 * 1000;

function waveLine(state: WaveState, newMemberId: string): string {
  const names = [...state.wavers.values()];
  const shown = names.slice(0, 3).map((n) => `**${n}**`).join(', ');
  const extra = names.length > 3 ? ` + ${names.length - 3} other${names.length - 3 === 1 ? '' : 's'}` : '';
  return `👋 ${shown}${extra} waved at <@${newMemberId}> — welcome!`;
}

if (!TOKEN) {
  console.error('[bot-seed] DISCORD_BOT_TOKEN not set in .env — cannot start.');
  process.exit(1);
}

async function registerCommands(): Promise<void> {
  if (!CLIENT_ID) throw new Error('DISCORD_CLIENT_ID not set — needed to register slash commands');
  const body = COMMANDS.map((c) => c.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  if (GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
    console.log(`[bot-seed] registered ${body.length} guild commands in ${GUILD_ID}: ${body.map((c) => '/' + (c as { name: string }).name).join(', ')}`);
  } else {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body });
    console.log(`[bot-seed] registered ${body.length} global commands (can take up to an hour): ${body.map((c) => '/' + (c as { name: string }).name).join(', ')}`);
  }
}

async function run(): Promise<void> {
  const loftOn = agencyChatEnabled();
  const intents = [GatewayIntentBits.Guilds];
  if (GREETER_ON) intents.push(GatewayIntentBits.GuildMembers);
  if (loftOn) intents.push(GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent);

  const client = new Client({ intents });
  const registry = new Collection<string, Command>();
  for (const c of COMMANDS) registry.set(c.data.name, c);

  client.once(Events.ClientReady, (c) => {
    const loftCh = loftChannelId();
    console.log(`[bot-seed] logged in as ${c.user.tag}`);
    console.log(`  commands: ${[...registry.keys()].map((n) => '/' + n).join(', ')}`);
    console.log(
      `  greeter: ${
        GREETER_ON
          ? 'ON → #' + WELCOME_CHANNEL
          : !WELCOME_CHANNEL
            ? 'OFF (set WELCOME_CHANNEL_ID)'
            : 'OFF — set BOT_ENV=production or FORCE_GREETER=1'
      } · loft: ${
        loftOn
          ? loftCh
            ? 'ON → #' + loftCh + (webhookFacesEnabled() ? ' (webhook faces)' : ' (APP replies)')
            : 'ON but AGENCY_CHANNEL_ID empty'
          : 'off (set AGENCY_CHAT=1 + Message Content Intent)'
      }`,
    );
  });

  if (loftOn) {
    client.on(Events.MessageCreate, async (message) => {
      try {
        await handleLoftMessage(message);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[bot-seed] loft error:', msg);
      }
    });
  }

  if (GREETER_ON) {
    client.on(Events.GuildMemberAdd, async (member) => {
      if (GUILD_ID && member.guild.id !== GUILD_ID) return;
      try {
        const channel =
          member.guild.channels.cache.get(WELCOME_CHANNEL) ??
          (await member.guild.channels.fetch(WELCOME_CHANNEL).catch(() => null));
        if (!channel || !channel.isTextBased()) {
          console.error(`[bot-seed] welcome channel ${WELCOME_CHANNEL} not found/text-based`);
          return;
        }
        const msg = buildGreeting(member);
        const sent = await channel.send({ ...msg, allowedMentions: { users: [member.id] } });
        setTimeout(() => {
          sent.edit({ components: [waveRow(member.id, true)] }).catch(() => {});
          waves.delete(sent.id);
        }, WAVE_LIFETIME_MS);
        console.log(`[bot-seed] greeted ${member.user.tag} (member #${member.guild.memberCount})`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[bot-seed] failed to greet: ${msg}`);
      }
    });
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton() && interaction.customId.startsWith('wave:')) {
      const newMemberId = interaction.customId.slice('wave:'.length);
      try {
        if (interaction.user.id === newMemberId) {
          await interaction.reply({
            content: "You can't wave at yourself — but we're glad you're here!",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
        let st = waves.get(interaction.message.id);
        if (!st) {
          st = { wavers: new Map() };
          waves.set(interaction.message.id, st);
        }
        if (st.wavers.has(interaction.user.id)) {
          await interaction.reply({ content: '👋 You already waved.', flags: MessageFlags.Ephemeral });
          return;
        }
        const m = interaction.member;
        const display =
          (m && 'displayName' in m && typeof m.displayName === 'string' ? m.displayName : null) ??
          interaction.user.username;
        st.wavers.set(interaction.user.id, display);
        await interaction.deferUpdate();

        const channel = interaction.channel;
        if (!channel || !channel.isTextBased() || !('send' in channel)) return;
        if (!st.waveMessageId) {
          const waveMsg = await channel.send({
            content: waveLine(st, newMemberId),
            reply: { messageReference: interaction.message.id, failIfNotExists: false },
            allowedMentions: { users: [newMemberId] },
          });
          st.waveMessageId = waveMsg.id;
        } else {
          const waveMsg = await channel.messages.fetch(st.waveMessageId).catch(() => null);
          if (waveMsg) {
            await waveMsg.edit({ content: waveLine(st, newMemberId), allowedMentions: { users: [] } });
          } else {
            const fresh = await channel.send({
              content: waveLine(st, newMemberId),
              allowedMentions: { users: [] },
            });
            st.waveMessageId = fresh.id;
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[bot-seed] wave error:', msg);
      }
      return;
    }
    if (!interaction.isChatInputCommand()) return;
    const cmd = registry.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`[bot-seed] /${interaction.commandName} error:`, detail);
      const msg = `⚠️ **/${interaction.commandName}** failed — try again in a moment.`;
      if (interaction.deferred || interaction.replied) await interaction.editReply(msg).catch(() => {});
      else await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  });

  await client.login(TOKEN);
}

if (process.argv.includes('--register')) {
  registerCommands().catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[bot-seed] register failed:', msg);
    process.exit(1);
  });
} else {
  run().catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[bot-seed] fatal:', msg);
    process.exit(1);
  });
}
