const Discord = require("discord.js");
const config = require("../config.json");
const commandParser = require("./command-parser.js");


const client = new Discord.Client();

client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(commandParser.prefix)) return;


  console.log(`Message: ${message.content}`);
  const commandBody = message.content.slice(commandParser.prefix.length);
  const command = commandParser.parse(commandBody);
  console.log(`Command: '${JSON.stringify(command)}'`);

  if (command.command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    message.reply(`Arguments: ${command.args}`);
  }                        

});

client.login(config.BOT_TOKEN);
