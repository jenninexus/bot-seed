/**
 * /help — list seed commands. Ephemeral (only the asker sees it).
 */
import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { BRAND_NAME, SITE_URL, LOGO_1x1, EMBED_BAR } from '../lib/assets.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('What can this bot do?');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const logo = LOGO_1x1();
  const site = SITE_URL();
  const brand = BRAND_NAME();

  const embed = new EmbedBuilder()
    .setColor(EMBED_BAR())
    .setAuthor({ name: brand, url: site, iconURL: logo })
    .setTitle(`${brand} — commands`)
    .setDescription(`Here's what I can do in this server:\n\n🌐 **[${site.replace(/^https?:\/\//, '')}](${site})**`)
    .addFields(
      { name: 'ℹ️ `/about`', value: 'Who this community is', inline: false },
      { name: '🔗 `/socials`', value: 'Website and social links', inline: false },
      { name: 'ℹ️ `/help`', value: 'This message', inline: false },
    )
    .setFooter({ text: brand, iconURL: logo });

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
