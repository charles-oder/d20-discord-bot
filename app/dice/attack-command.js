var diceRoller = require("./dice-roller.js");
const log = require("../log.js");

const prefix = "!attack";

function createHelpMessage() {
  let msg = "Usage: !attack +x/+x... [options]\n";
  msg += "Options:\n";
  msg += "\t\t\"crit:19\" Sets the critical threshold to 19-20\n";
  msg += "\t\t\"fumble:0\" Sets roll for fumbles (0 disables)\n";
  msg += "Examples:\n";
  msg += "\t\t\"!attack +1\" Rolls a single attack with a +1 bonus\n";
  msg += "\t\t\"!roll +6/+1/+6\" Rolls 3 attacks\n";
  msg += "\t\t\"!roll +6/+1 crit:19\" Rolls 2 attacks with a critical threat of 19-20\n";
  msg += "\t\t\"!roll +6/+1 crit:19 fumble:0\" Rolls 2 attacks with a critical threat of 19-20 and no fumble on natural 1s\n";
  return msg;
}
const history = {}

function processMessage(message) {
  if (!message.content.startsWith(prefix)) return false;
  log.debug(message.content);
  if (message.content.includes("help")) {
    message.channel.send(createHelpMessage());
    return false;
  }
  const author = message.member.displayName;
  log.debug("User: " + author);
  let body = message.content.replace(prefix, "").trim();
  // if (!body) {
  //   log.debug("no body provided, loading last roll");
  //   body = module.exports.history[author];
  // }
  // if (!body) {
  //   log.debug("No body provided, showing help");
  //   message.channel.send(createHelpMessage());
  //   return true;
  // }
  log.debug("body: " + body);
  const tokens = body.split(" ");
  log.debug("tokens: " + JSON.stringify(tokens));
  const resultSets = [];
  const attackString = tokens.shift();
  const attacks = attackString.split("/");
  const critThreat = 20;
  const fumbleThreat = 1;
  let total = 0;
  let response = "";
  attacks.forEach(attackBonus => {
    const naturalRoll = diceRoller.rollString("d20");
    const modifier = parseInt(attackBonus);
    const modifiedRoll = naturalRoll + modifier;
    resultSets.push(modifiedRoll);
    response += `${author} attacks! Roll: ${naturalRoll} + ${modifier}`;
    response += ` = **${modifiedRoll}**`;
    if (naturalRoll >= critThreat) {
      const backupRoll = diceRoller.rollString("d20");
      const backupTotal = backupRoll + modifier;
      response += `, *Critical Threat* Backup Roll: ${backupRoll} + ${modifier} = **${backupTotal}**`;
    }
    if (naturalRoll <= fumbleThreat) {
      const backupRoll = diceRoller.rollString("d20");
      const backupTotal = backupRoll + modifier;
      response += `, *Fumble* Backup Roll: ${backupRoll} + ${modifier} = **${backupTotal}**`;
    }
    response += `\n`;

  });
  log.debug("Setting history for " + author + ": " + body);
  module.exports.history[author] = body;
  message.channel.send(response);
  return true;
}

module.exports.processMessage = processMessage;
module.exports.diceRoller = diceRoller;
module.exports.history = history;