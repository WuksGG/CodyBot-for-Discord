const { discord: { client } } = require('#helpers');

const {
  messageCreate: {
    init,
  },
} = require('#models');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.content === 'ping') {
      message.channel.send('pong');
    } else if (message.content === 'init') {
      // init(message);
      console.log(client);
      console.log(await message.author.fetchFlags());
    }
  },
};
