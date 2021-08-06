/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
const fs = require('fs');
require('dotenv').config({ path: './configuration/.env' });

const { client } = require('#models/discord');
const calendar = require('#models/calendar');

calendar.init();

(async () => {
  // if db is empty
  // calendarData.populateDatabase();

  // if testing db stuff
  // const events = await calendarData.getFromDatabase();
  // console.log(events);
})();

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
