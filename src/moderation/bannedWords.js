const patterns = require("../../config/bannedWords.json").map(
  p => new RegExp(p, "i")
);

// userWarnings structure:
// Map<username, { count: number }>
const userWarnings = new Map();

const MAX_WARNINGS = 3;
const TIMEOUT_SECONDS = 600; // 10 minutes

module.exports = (client, channel, user, message) => {
  for (const regex of patterns) {
    if (!regex.test(message)) continue;

    // Delete the offending message
    client.deletemessage(channel, tags.id);

    const data = userWarnings.get(user) || { count: 0 };
    data.count += 1;

    // Timeout after max warnings
    if (data.count >= MAX_WARNINGS) {
      client.timeout(
        channel,
        user,
        TIMEOUT_SECONDS,
        "Repeated banned words"
      );

      userWarnings.delete(user);
      return true;
    }

    // Warn user
    userWarnings.set(user, data);
    client.say(
      channel,
      `@${user} warning ${data.count}/${MAX_WARNINGS}: banned language is not allowed.`
    );

    return true;
  }

  return false;
};
