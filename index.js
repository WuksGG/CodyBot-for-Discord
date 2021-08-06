/* eslint-disable import/no-unresolved */
const fs = require('fs');
require('dotenv').config({ path: './configuration/.env' });

const { discord: { client } } = require('#models');
const { calendarData } = require('#helpers');

const cron = require('node-cron');
cron.schedule('*/1 * * * *', async () => {
  const events = await calendarData.getFromDatabase();
  // then post
  // then update
  console.log(events);
});

(async () => {
  // if db is empty
  // getCalendarData.populateDatabase();

  // if testing db stuff
  // const events = await getCalendarData.getFromDatabase();
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
