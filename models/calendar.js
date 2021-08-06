/* eslint-disable import/no-unresolved */
const { MessageEmbed } = require('discord.js');
const cron = require('node-cron');

const { calendar: { channelId } } = require('#config');
const { discord: { client } } = require('#helpers');
const calendarData = require('#models/calendarData');

const eventEmbedGenerator = ({
  summary,
  // description,
  start,
  end,
  location,
}) => {
  const dateToReadable = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
  };
  const calendarReminderEmbed = new MessageEmbed()
    .setColor('#33FFE7')
    .setTitle(summary)
    .setAuthor('CodyBot (but for Discord)', 'https://avatars.slack-edge.com/2019-02-01/540531868533_9e67c4bd47a960061ba8_192.png', 'https://github.com/WuksGG/CodyBot-for-Discord')
    .setDescription(['Lunch', 'Dinner'].includes(summary)
      ? `@here It's Time For ${summary}`
      : `@here 3 Minutes until ${summary}.`)
    .addFields(
      { name: 'Start Time:', value: dateToReadable(start), inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
      { name: 'Location:', value: location || 'N/A', inline: true },
      { name: 'End Time:', value: dateToReadable(end), inline: false },
    )
    .setTimestamp()
    .setFooter('Made with 💖 by SFO136');
  return calendarReminderEmbed;
};

const scheduleTask = (event) => {
  if (event.summary === 'Pre-Party') return;
  const startDate = new Date(event.start);
  const adjustedStartDate = ['Lunch', 'Dinner'].includes(event.summary)
    ? startDate
    : new Date(startDate - (1000 * 60 * 3));
  const [hours, minutes] = [adjustedStartDate.getHours(), adjustedStartDate.getMinutes()];
  process.stdout.write(`Event Scheduled: ${event.summary} at ${adjustedStartDate.toLocaleTimeString()}\n`);
  const task = cron.schedule(`${minutes} ${hours} * * *`, async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      channel.send({ embeds: [eventEmbedGenerator(event)] });
    } catch (e) {
      process.stdout.write(e.stack);
      process.stdout.write('\n');
    }
    task.destroy();
  });
};

const init = async () => {
  const schedulingLogic = async () => {
    const [err, events] = await calendarData.getFromDatabase();
    if (err) return;
    events.forEach((event) => scheduleTask(event));
  }

  const dateNow = new Date();
  const hourNow = dateNow.getHours();
  // Bypass cron if application reset
  if (hourNow > 6) schedulingLogic();

  // Schedule the jobs at 6am daily
  cron.schedule('0 6 * * *', async () => {
    schedulingLogic();
  });
  // SAMPLE TEST DATA
  // events.push({
  //   id: 'k44v3h54vsqvp5fjr5tljic63c',
  //   summary: 'Lunch',
  //   description: null,
  //   start: '2021-08-07T06:23:00.000Z',
  //   end: '2021-08-07T03:00:00.000Z',
  //   sent: null,
  //   location: null,
  // });
};

module.exports = {
  init,
};
