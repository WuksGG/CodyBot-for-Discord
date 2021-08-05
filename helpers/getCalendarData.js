const axios = require('axios');

// eslint-disable-next-line import/no-unresolved
const { calendar } = require('#config');

const gapi = async () => {
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

const init = async () => {
  const [err, data] = await gapi();
  if (err) {
    process.stdout.write(err.stack);
    process.stdout.write('\n');
    return err;
  }
  data.data.items.forEach((item) => {
    if (item.start.dateTime) {
      const {
        id,
        summary,
        description,
        start,
        end,
      } = item;
      const dPk = {
        id,
        summary,
        description,
        start,
        end,
      };
      process.stdout.write(dPk);
      process.stdout.write('\n');
    }
  });
  return data;
};

// init();
// Compare and add/remove
module.exports = init;
