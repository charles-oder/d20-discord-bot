const Discord = require("discord.js");
const config = require("../config.json");
const commandParser = require("./command-parser.js");
const ping = require("./ping.js");


const client = new Discord.Client();

client.on("message", function(message) {
  if (message.author.bot) return;
  const command = commandParser.parse(message.content);
  if (!command.command) return;

  if (command.command === ping.command) {
    const response = ping.ping(message.createdTimestamp);
    console.log(response);
    message.reply(response);
  }                        

});

client.login(config.BOT_TOKEN);
