/**
 * /about — community identity hub. Reads brand + site from assets.json.
 */
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { BRAND_NAME, SITE_URL, LOGO_1x1, EMBED_BAR, socials } from '../lib/assets.js';

export const data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('About this community');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const logo = LOGO_1x1();
  const site = SITE_URL();
  const brand = BRAND_NAME();
  const discord = socials().find((s) => s.label.toLowerCase() === 'discord');

  const lines = [
    `🌐  **[${brand}](${site})** — official site`,
  ];
  if (discord) lines.push(`${discord.emoji}  **[${discord.handle}](${discord.url})** — this Discord`);

  const embed = new EmbedBuilder()
    .setColor(EMBED_BAR())
    .setAuthor({ name: brand, url: site, iconURL: logo })
    .setTitle(`Welcome to ${brand}`)
    .setURL(site)
    .setThumbnail(logo)
    .setDescription(lines.join('\n') + `\n\nTry **/socials** for every link.`)
    .setFooter({ text: brand, iconURL: logo })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
