require("dotenv").config();
const tmi = require("tmi.js");
const config = require("../config/glxyconfig.json");
const bannedWordsCheck = require("./moderation/bannedWords");

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: config.username,
    password: process.env.TWITCH_OAUTH
  },
  channels: [config.channel]
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const user = tags.username;

  bannedWordsCheck(client, channel, user, message, config.timeout);
});
