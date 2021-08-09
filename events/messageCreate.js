const {
  messageCreate: {
    init,
  },
} = require('#models');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Zero-Permission Routes
    if (message.content === 'ping') {
      message.channel.send('pong');
    }
    // Administrator Routes
    if (await message.member.permissions.has('ADMINISTRATOR')) {
      if (message.content === 'init') {
        init(message);
      }
    }
  },
};
