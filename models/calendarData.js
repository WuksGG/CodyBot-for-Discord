const { database: { db } } = require('#helpers');

const getFromDatabase = async () => {
  try {
    const query = `
      SELECT *
      FROM events
      WHERE sent IS NULL
        AND start > NOW()
        AND start < NOW() + INTERVAL '14 hours'
      ORDER BY start DESC;
    `;
    return [null, await db.any(query)];
  } catch (e) {
    process.stdout.write(e.stack);
    process.stdout.write('\n');
    return [e];
  }
};

module.exports = {
  getFromDatabase,
};
