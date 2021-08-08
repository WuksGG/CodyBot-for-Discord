const axios = require('axios');
const readline = require('readline');
require('dotenv').config({ path: './configuration/.env' });

const { calendar } = require('#config');
const { pgp, db } = require('#helpers/database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    return 1;
  } catch (e) {
    process.stdout.write(`${e.stack}\n`);
    return 0;
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
    process.stdout.write(`${e.stack}\n`);
    return [e];
  }
};

const createTableIfNotExists = () => {
  const query = '';
};

const populateDatabase = async () => {
  // Create table if does not exist

  // Clear table if exists

  // Populate table
  const [err, data] = await getGoogleCalendarData();
  if (err) return err;
  return storeToDatabase(data);
};

const writeNewLines = () => {
  process.stdout.write('\n\n');
};
process.on('exit', writeNewLines);

rl.question('\x1b[31m\x1b[1mRunning this script will delete any existing \'events\' table in the database.\x1b[0m\n'
  + '\x1b[36mAre you sure you want to run this script?\x1b[0m (y/N) ', async (answer) => {
  process.removeListener('exit', writeNewLines);
  process.stdout.write('\n');
  if (['yes', 'y'].includes(answer.toLowerCase())) {
    const status = await populateDatabase();
    process.stdout.write('\n');
    process.exit(status);
  }
  // Non-yes answer, closing process without execution
  process.exit(0);
});
