const { Client, Collection } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const client = new Client({
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach((handler) => {
  require(`./handlers/command`)(client);
});
const eventhandler = require("./handlers/events");
eventhandler(client);
const gitWebhook = require("./structures/webhook");
gitWebhook(client);

client.login(config.token);
