const Discord = require("discord.js");
const config = require("../config.json");
const commandParser = require("./command-parser.js");
const ping = require("./ping.js");
const rollCommand = require("./dice/roll-command.js");

const client = new Discord.Client();

client.on("message", function(message) {
  try {
    if (message.author.bot) return;
    if (rollCommand.processMessage(message)) {
      message.delete();
    }
  } catch(error) {
    console.log(error);
  }
});

client.login(config.BOT_TOKEN);
