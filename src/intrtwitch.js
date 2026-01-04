require("dotenv").config();
const tmi = require("tmi.js");
const config = require("../config/glxyconfig.json");

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: config.username,
    password: process.env.TWITCH_OAUTH
  },
  channels: [config.channel]
});

client.connect();

