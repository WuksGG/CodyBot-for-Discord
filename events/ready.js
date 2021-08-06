// eslint-disable-next-line import/no-unresolved
const { discord: { client } } = require('#models');

// Listeners
module.exports = {
  name: 'ready',
  once: true,
  async execute() {
    process.stdout.write(`Logged in as ${client.user.tag}!\n`);
  },
};
