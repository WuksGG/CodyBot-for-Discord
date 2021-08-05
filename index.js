/* eslint-disable import/no-unresolved */
require('dotenv').config({ path: './configuration/.env' });
const fs = require('fs');

const { getCalendarData, discord: { client } } = require('#helpers');
const { database: { db } } = require('#models');

db.any('SELECT * FROM events')
  .then(r => console.log(r));

// getCalendarData();

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
eventFiles.forEach((file) => {
  // eslint-disable-next-line import/no-dynamic-require
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});
