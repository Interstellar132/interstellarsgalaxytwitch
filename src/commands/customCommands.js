const commands = require("../../config/commands.json");

module.exports = (client, channel, message) => {
  const content = message.trim().toLowerCase();

  if (!content.startsWith("!")) return false;

  const response = commands[content];
  if (!response) return false;

  client.say(channel, response);
  return true;
};

