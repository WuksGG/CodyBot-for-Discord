module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.content === 'ping') {
      message.channel.send('pong');
    }
  },
};
