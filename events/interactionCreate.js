module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'ping') {
      try {
        await interaction.reply('Pong!');
      } catch (e) {
        process.stdout.write(e.stack);
        process.stdout.write('\n');
      }
    } else if (interaction.commandName === 'zooms') {
      // Links Zooms + Descriptions
      // Should be abstracted in a config file
      try {
        await interaction.reply('RAWR');
      } catch (e) {
        process.stdout.write(e.stack);
        process.stdout.write('\n');
      }
    }
  },
};
