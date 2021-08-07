const { zoom: { cohort, rooms } } = require('#config');

const zoomRichEmbed = {
  color: '#33FFE7',
  title: ` Zoom Rooms for ${cohort}`,
  // url: 'https://discord.js.org',
  author: {
    name: 'CodyBot (but for Discord)',
    icon_url: 'https://avatars.slack-edge.com/2019-02-01/540531868533_9e67c4bd47a960061ba8_192.png',
    url: 'https://github.com/WuksGG/CodyBot-for-Discord',
  },
  // description: 'Description',
  thumbnail: {
    url: 'https://cdn.iconscout.com/icon/free/png-256/zoom-2471913-2050545.png',
  },
  fields: rooms,
  // image: {
  //   url: 'https://i.imgur.com/AfFp7pu.png',
  // },
  timestamp: new Date(),
  footer: {
    text: 'Made with ❤️ by students from SFO136',
    // icon_url: 'https://i.imgur.com/AfFp7pu.png',
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
        process.stdout.write(e.stack);
        process.stdout.write('\n');
      }
    } else if (interaction.commandName === 'zoom') {
      // Links Zooms + Descriptions
      // Should be abstracted in a config file
      try {
        await interaction.reply(rooms.length
          ? { embeds: [zoomRichEmbed] }
          : 'No rooms added.');
      } catch (e) {
        process.stdout.write(e.stack);
        process.stdout.write('\n');
      }
    }
  },
};
