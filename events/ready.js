// eslint-disable-next-line import/no-unresolved
const { client } = require('#models/discord');

// Listeners
module.exports = {
  name: 'ready',
  once: true,
  async execute() {
    process.stdout.write(`Logged in as ${client.user.tag}!\n`);
  },
};
