const Discord = require("discord.js");
const config = require("../config.json");
const rollCommand = require("./dice/roll-command.js");
const attackCommand = require("./dice/attack-command.js");
const log = require.main.require("./log.js");

const client = new Discord.Client();

client.on("message", function(message) {
  try {
    if (message.author.bot) return;
    let commands = [
      rollCommand,
      attackCommand
    ];
    commands.forEach(command => {
      let response = command.processMessage(message);
      if (response) {
        if (message.channel.type === "dm") {
          message.author.send(response.message);
        } else {
          if (response.replaceRequest) {
            message.delete();
          }
          message.channel.send(response.message);
        }
      }
    });
  } catch(error) {
    log.error(error);
  }
});

client.login(config.BOT_TOKEN);
