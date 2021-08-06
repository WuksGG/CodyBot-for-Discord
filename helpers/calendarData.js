/* eslint-disable import/no-unresolved */
const axios = require('axios');

const { calendar } = require('#config');
const { pgp, db } = require('../models/database');

const storeToDatabase = async ({ items: events }) => {
  const eventsColumnSet = new pgp.helpers.ColumnSet(
    [
      'id',
      'summary',
      'description',
      'start',
      'end',
      'location',
    ],
    { table: 'events' },
  );

  const parsedCalendarData = events
    .filter((calendarEvent) => calendarEvent.start.dateTime)
    .map((calendarEvent) => {
      const {
        id,
        summary,
        description,
        start,
        end,
        location,
      } = calendarEvent;
      return {
        id,
        summary,
        description,
        start: start.dateTime,
        end: end.dateTime,
        location,
      };
    });

  const query = pgp.helpers.insert(parsedCalendarData, eventsColumnSet);

  try {
    await db.none(query);
    process.stdout.write(`${parsedCalendarData.length} events added to the database!\n`);
  } catch (e) {
    process.stdout.write(e.stack);
    process.stdout.write('\n');
  }
};

const getGoogleCalendarData = async () => {
  const now = new Date();
  try {
    const req = await axios({
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
      params: {
        timeMin: now.toISOString(),
      },
      headers: {
        Authorization: `Bearer ${process.env.GCAL_TOKEN}`,
      },
    });
    return [null, req];
  } catch (e) {
    return [e];
  }
};

const populateDatabase = async () => {
  // Populates Database
  const [err, data] = await getGoogleCalendarData();
  if (err) {
    process.stdout.write(err.stack);
    process.stdout.write('\n');
    return err;
  }
  storeToDatabase(data.data);
  return 0;
};

const getFromDatabase = async () => {
  try {
    let query = 'SELECT * FROM events';
    query += ' WHERE sent IS NULL AND start > NOW()';
    // now < event < now + 5
    query += ' AND start < NOW() + interval \'14 hours\'';
    query += ' ORDER BY start;';
    return [null, await db.any(query)];
  } catch (e) {
    return [e];
  }
};

// const markAsSent = async (id) => {
//   // After an event is posted to channel,
//   // mark the event as sent so it's not resent.
//   try {
//     console.log(id);
//     return [null, true];
//   } catch (e) {
//     return [e];
//   }
// };

module.exports = {
  populateDatabase,
  getFromDatabase,
  // markAsSent,
};
