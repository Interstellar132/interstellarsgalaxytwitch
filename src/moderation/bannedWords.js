const bannedWords = require("../../config/bannedWords.json");

module.exports = (client, channel, user, message, timeout) => {
  const lower = message.toLowerCase();

  for (const word of bannedWords) {
    if (lower.includes(word.toLowerCase())) {
      client.timeout(channel, user, timeout, "Prohibited term.");
      return true;
    }
  }

  return false;
};

