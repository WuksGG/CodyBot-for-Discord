const fs = require('fs');
require('dotenv').config({ path: './configuration/.env' });

const { discord: { client } } = require('#helpers');
const { calendar } = require('#models');

calendar.init();

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
eventFiles.forEach((file) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});
