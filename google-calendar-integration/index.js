const axios = require('axios');
const readline = require('readline');
require('dotenv').config({ path: './configuration/.env' });

const { calendar } = require('#config');
const { pgp, db } = require('#helpers/database');
const OAuth2 = require('./oauth2');

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
      'timestart',
      'timeend',
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
        timestart: start.dateTime,
        timeend: end.dateTime,
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

const getGoogleCalendarData = async (accessToken) => {
  const now = new Date();
  try {
    const { data } = await axios({
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
      params: {
        timeMin: now.toISOString(),
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return [null, data];
  } catch (e) {
    process.stdout.write(`${e.stack}\n`);
    return [e];
  }
};

const generateCleanTable = async () => {
  try {
    await db.query('DROP TABLE IF EXISTS events;');
    await db.query(`CREATE TABLE events (
      id VARCHAR(40) NOT NULL PRIMARY KEY,
      summary VARCHAR NOT NULL,
      description VARCHAR,
      location VARCHAR,
      timestart TIMESTAMPTZ NOT NULL,
      timeend TIMESTAMPTZ NOT NULL
    );`);
    return [null];
  } catch (e) {
    return [e];
  }
};

const populateDatabase = async () => {
  const [oAuthErr, accessToken] = await OAuth2();
  if (oAuthErr) return 0;
  // Create table if does not exist
  await generateCleanTable();
  // Populate table
  const [getGcErr, data] = await getGoogleCalendarData(accessToken);
  if (getGcErr) return 0;
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
