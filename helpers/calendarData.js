const axios = require('axios');
// eslint-disable-next-line import/no-unresolved
const { calendar } = require('#config');
const { database: { pgp, db } } = require('#models');

const storeToDatabase = async ({ items: events }) => {
  const eventsColumnSet = new pgp.helpers.ColumnSet(
    [
      'id',
      'summary',
      'description',
      'start',
      'end',
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
      } = calendarEvent;
      return {
        id,
        summary,
        description,
        start: start.dateTime,
        end: end.dateTime,
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
    query += ' AND start < NOW() + interval \'80 minutes\'';
    query += ' ORDER BY start LIMIT 1;';
    return [null, await db.any(query)];
  } catch (e) {
    return [e];
  }
};

module.exports = {
  populateDatabase,
  getFromDatabase,
};
