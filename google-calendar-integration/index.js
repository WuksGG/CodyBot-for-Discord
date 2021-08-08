const axios = require('axios');
require('dotenv').config({ path: './configuration/.env' });

const { calendar } = require('#config');
const { pgp, db } = require('#helpers/database');

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
    const { data } = await axios({
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
      params: {
        timeMin: now.toISOString(),
      },
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_CALENDAR_TOKEN}`,
      },
    });
    return [null, data];
  } catch (e) {
    process.stdout.write(e.stack);
    process.stdout.write('\n');
    return [e];
  }
};

const populateDatabase = async () => {
  const [err, data] = await getGoogleCalendarData();
  if (err) return err;
  storeToDatabase(data);
  return 0;
};

populateDatabase();
