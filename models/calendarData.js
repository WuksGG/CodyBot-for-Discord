const { database: { db } } = require('#helpers');

const getFromDatabase = async () => {
  try {
    const query = `
      SELECT *
      FROM events
      WHERE timestart > NOW()
        AND timestart < NOW() + INTERVAL '15 hours'
      ORDER BY timestart DESC;
    `;
    return [null, await db.any(query)];
  } catch (e) {
    process.stdout.write(`${e.stack}\n`);
    return [e];
  }
};

module.exports = {
  getFromDatabase,
};
