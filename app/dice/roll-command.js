var diceRoller = require("./dice-roller.js");
const log = require("../log.js");
const docManager = require("../persistance/doc-manager.js");

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

function processMessage(message) {
  if (!message.content.startsWith(prefix)) return undefined;
  log.debug(`Channel(${message.channel.type}): ${message.channel.id}`);
  log.debug("Message: " + message.content);
  if (message.content.includes("help")) {
    return { message: createHelpMessage(), replaceRequest: false };
  }
  log.debug("Member:" + JSON.stringify(message.member));
  log.debug("Author:" + JSON.stringify(message.author));
  const author = message.member ? message.member.displayName : message.author.displayName;
  const authorId = message.author.id;
  log.debug(`User: ${author} (${authorId})`);
  const userData = docManager.loadDocument(authorId);
  log.debug("User Data: " + JSON.stringify(userData));
  let body = message.content.replace(prefix, "").trim();
  if (!body) {
    log.debug("no body provided, loading last roll");
    body = userData.lastRoll
  }
  if (!body) {
    log.debug("No body provided, showing help");
    return { message: createHelpMessage(), replaceRequest: true };
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
  let rollOutput = "";
  resultSets.forEach(set => {
    rollOutput += JSON.stringify(set);
  });
  rollOutput += ` = **${total}**`;
  log.debug("Setting history for " + authorId + ": " + body);
  userData.lastRoll = body;
  docManager.saveDocument(authorId, userData);
  let response = message.channel.type === "dm"
    ? `You roll ${body}: ${rollOutput}`
    : `${author} rolls ${body}: ${rollOutput}`;
    
  return { message: response, replaceRequest: true };
}

module.exports.processMessage = processMessage;
module.exports.diceRoller = diceRoller;
