const { embeds } = require('#config');

const welcomeRichEmbed = embeds.welcome;

module.exports = async (message) => {
  const welcomeMessage = await message.channel.send({ embeds: [welcomeRichEmbed] });
  await welcomeMessage.react('🟥');
  await welcomeMessage.react('🟦');
  await welcomeMessage.react('🟩');
  message.delete();
};
