const Discord = require("discord.js");
const config = require("../config.json");
const rollCommand = require("./dice/roll-command.js");
const attackCommand = require("./dice/attack-command.js");
const log = require.main.require("./log.js");

const client = new Discord.Client();

client.on("message", function(message) {
  try {
    if (message.author.bot) return;
    if (rollCommand.processMessage(message)) {
      message.delete();
    }
    if (attackCommand.processMessage(message)) {
      message.delete();
    }
  } catch(error) {
    log.error(error);
  }
});

client.login(config.BOT_TOKEN);
