const welcome = require('./welcome');

const channelIdsToMessage = {
  872574904275464302: welcome,
};

module.exports = async (message) => {
  try {
    channelIdsToMessage[message.channel.id](message);
  } catch (e) {
    console.log(e);
  }
};
