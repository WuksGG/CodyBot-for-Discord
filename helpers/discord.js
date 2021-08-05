const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');
// eslint-disable-next-line import/no-unresolved
const { discord: { clientId, guildId } } = require('#config');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

// Slash Commands Init

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'test',
    description: 'testtest',
  },
];

const rest = new REST({ version: '9' })
  .setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    process.stdout.write('Started refreshing application (/) commands.\n');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
    process.stdout.write('Successfully reloaded application (/) commands.\n');
  } catch (error) {
    process.stdout.write(error);
    process.stdout.write('\n');
  }
})();

// Listeners

client.once('ready', () => {
  process.stdout.write(`Logged in as ${client.user.tag}!\n`);
});

client.login(process.env.DISCORD_TOKEN);

module.exports = {
  client,
};
