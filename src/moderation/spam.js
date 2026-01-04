const userData = new Map();

/*
userData structure:
{
  messages: [timestamps],
  warnedAt: number | null
}
*/

module.exports = (client, channel, user, config) => {
  const now = Date.now();

  const data = userData.get(user) || {
    messages: [],
    warnedAt: null
  };

  // Track messages
  data.messages.push(now);
  data.messages = data.messages.filter(
    t => now - t < config.interval
  );

  // Spam detected
  if (data.messages.length > config.maxMessages) {
    // First offense → warn
    if (!data.warnedAt || now - data.warnedAt > config.warnCooldown) {
      client.say(
        channel,
        `@${user} please stop spamming. Continuing to do so will result in a mute.`
      );

      data.warnedAt = now;
      data.messages = []; // reset message count after warning
      userData.set(user, data);
      return true;
    }

    // Second offense → timeout
    client.timeout(channel, user, config.timeout, "Chat spam");
    userData.delete(user);
    return true;
  }

  userData.set(user, data);
  return false;
};
