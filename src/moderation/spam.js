const userMessages = new Map();

module.exports = (client, channel, user, config) => {
  const now = Date.now();
  const messages = userMessages.get(user) || [];

  messages.push(now);
  const filtered = messages.filter(t => now - t < config.interval);
  userMessages.set(user, filtered);

  if (filtered.length > config.maxMessages) {
    client.timeout(channel, user, config.timeout, "Spamming");
    return true;
  }

  return false;
};

