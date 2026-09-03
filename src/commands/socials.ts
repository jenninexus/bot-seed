/**
 * /socials — website + platform links from resources/assets.json.
 */
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { socials, BRAND_NAME, SITE_URL, LOGO_1x1, EMBED_BAR } from '../lib/assets.js';

export const data = new SlashCommandBuilder()
  .setName('socials')
  .setDescription('Social media and community links');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const list = socials();
  const logo = LOGO_1x1();
  const site = SITE_URL();
  const brand = BRAND_NAME();
  const lines = list.map((s) => `${s.emoji}  **[${s.handle}](${s.url})**`);

  const embed = new EmbedBuilder()
    .setColor(EMBED_BAR())
    .setAuthor({ name: brand, url: site, iconURL: logo })
    .setTitle(`Follow ${brand}`)
    .setURL(site)
    .setThumbnail(logo)
    .setDescription(
      (lines.length ? lines.join('\n') : `🌐  **[${brand}](${site})**`) +
        `\n\n🔗  **[All links → ${site.replace(/^https?:\/\//, '')}](${site})**`,
    )
    .setFooter({ text: brand, iconURL: logo })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
