const { discord: { client } } = require('#helpers');

// Listeners
module.exports = {
  name: 'ready',
  once: true,
  async execute() {
    process.stdout.write(`Logged in as ${client.user.tag}!\n`);
  },
};
