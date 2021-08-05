module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'ping') {
      try {
        await interaction.reply('Pong!');
      } catch (e) {
        console.log(e);
      }
    } else if (interaction.commandName === 'zooms') {
      // Links Zooms + Descriptions
      // Should be abstracted in a config file
      try {
        await interaction.reply('RAWR');
      } catch (e) {
        console.log(e);
      }
    }
  },
};
