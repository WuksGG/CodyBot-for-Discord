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
    }
  },
};
