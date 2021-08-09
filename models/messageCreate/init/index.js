const welcome = require('./welcome');

const channelIdsToMessage = [
  {
    channelId: '872574904275464302',
    method: welcome,
  },
  {
    channelId: '874157691889668116', // testing2
    method: welcome,
  },
  {
    channelId: '872243907201744906', // #welcome
    method: welcome,
  },
];

module.exports = async (message) => {
  const channelMatch = channelIdsToMessage.find(({ channelId }) => (
    channelId === message.channel.id
  ));
  return channelMatch && channelMatch.method(message);
};
