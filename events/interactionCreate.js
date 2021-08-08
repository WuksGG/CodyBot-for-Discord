const { zoom: { cohort, rooms } } = require('#config');

const zoomRichEmbed = {
  color: '#33FFE7',
  title: ` Zoom Rooms for ${cohort}`,
  thumbnail: {
    url: 'https://cdn.iconscout.com/icon/free/png-256/zoom-2471913-2050545.png',
  },
  fields: rooms,
  timestamp: new Date(),
  footer: {
    text: 'Made with ❤️ by students from SFO136',
  },
};

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'ping') {
      try {
        await interaction.reply('Pong!');
      } catch (e) {
        process.stdout.write(`${e.stack}\n`);
      }
    } else if (interaction.commandName === 'zoom') {
      try {
        await interaction.reply(rooms.length
          ? { embeds: [zoomRichEmbed] }
          : 'No rooms added.');
      } catch (e) {
        process.stdout.write(`${e.stack}\n`);
      }
    }
  },
};
