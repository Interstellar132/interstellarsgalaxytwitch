require("dotenv").config();
const tmi = require("tmi.js");

// Load config
const config = require("../config/glxyconfig.json");

// Moderation & commands
const bannedWordsCheck = require("./moderation/bannedWords");
const customCommands = require("./commands/customCommands");

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

// Message handler
client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const isBroadcaster = tags.badges?.broadcaster === "1";
  const isMod = tags.mod;
  const isPrivileged = isBroadcaster || isMod;

  /* =========================
     CUSTOM COMMANDS (ANYONE)
  ========================= */
  if (customCommands(client, channel, message)) {
    return;
  }

  /* =========================
     MODERATION (NON-MODS)
  ========================= */
  if (isPrivileged) return;

  const user = tags.username;

  bannedWordsCheck(
    client,
    channel,
    user,
    message,
    tags
  );
});

// Connection log
client.on("connected", (address, port) => {
  console.log(`Connected to ${address}:${port}`);
});
