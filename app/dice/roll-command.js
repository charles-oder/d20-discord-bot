var diceRoller = require("./dice-roller.js");
const log = require("../log.js");

const prefix = "!roll";

function createHelpMessage() {
  let msg = "Usage: !roll xdx [+xdx] [+x]\n";
  msg += "Examples:\n";
  msg += "\t\t\"!roll 3d6\" Rolls 3 6-sided dice\n";
  msg += "\t\t\"!roll 1d20 + 5\" Rolls 1 20-sided die and adds 5\n";
  msg += "\t\t\"!roll 1d8 + 2d6 + 5\" Rolls 1 8-sided die, 2 6-sided dice, and adds 5\n";
  msg += "\t\t\"!roll\" Repeats the last roll\n";
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
  if (!body) {
    log.debug("no body provided, loading last roll");
    body = module.exports.history[author];
  }
  if (!body) {
    log.debug("No body provided, showing help");
    message.channel.send(createHelpMessage());
    return false;
  }
  log.debug("body: " + body);
  const tokens = diceRoller.tokenize(body);
  log.debug("tokens: " + JSON.stringify(tokens));
  const resultSets = [];
  let total = 0;
  tokens.forEach(token => {
    const dice = diceRoller.createDice(token);
    log.debug("dice: " + JSON.stringify(dice));
    const results = [];
    dice.dice.forEach(die => {
      const roll = diceRoller.rollString(die);
      total += roll;
      results.push(roll);
    });
    resultSets.push(results);
  });
  let response = `${author} rolls ${body}: `;
  resultSets.forEach(set => {
    response += JSON.stringify(set);
  });
  response += ` = **${total}**`;
  log.debug("Setting history for " + author + ": " + body);
  module.exports.history[author] = body;
  message.channel.send(response);
  return true;
}

module.exports.processMessage = processMessage;
module.exports.diceRoller = diceRoller;
module.exports.history = history;