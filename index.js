require('dotenv').config({ path: './configuration/.env' });
const fs = require('fs');
// eslint-disable-next-line import/no-unresolved
const { discord: { client } } = require('#helpers');

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
  console.log(file);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
