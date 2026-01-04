require("dotenv").config();
const tmi = require("tmi.js");
const bannedWordsCheck = require("./moderation/bannedWords");

// Load config
const config = require("../config/glxyconfig.json");

// Create Twitch client
const client = new tmi.Client({
  options: {
    debug: true
  },
  identity: {
    username: config.username,
    password: process.env.TWITCH_OAUTH
  },
  channels: [config.channel]
});

// Connect to Twitch
client.connect();

// Listen for messages
client.on("message", (channel, tags, message, self) => {
  if (self) return;

  // Ignore mods and broadcaster (optional but recommended)
  if (tags.mod || tags.badges?.broadcaster === "1") return;

  const user = tags.username;

  bannedWordsCheck(
    client,
    channel,
    user,
    message,
    tags
  );
});

// Optional: log connection status
client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});
