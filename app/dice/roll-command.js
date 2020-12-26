const diceRoller = require("./dice-roller.js");

const prefix = "!roll";

function createHelpMessage() {
  let msg = "Usage: !roll xdx [+xdx] [+x]\n";
  msg += "  Examples: !roll 3d6";
  msg += "            !roll 1d20 + 5";
  msg += "            !roll 1d8 + 2d6 + 5";
  return msg;
}

function processMessage(message) {
  if (!message.content.startsWith(prefix)) return false;
  if (message.content.includes("help")) {
    message.reply(createHelpMessage());
    return false;
  }
  const author = message.author.username;
  const body = message.content.replace(prefix, "");
  console.log("body: " + body);
  const tokens = diceRoller.tokenize(body);
  console.log("tokens: " + JSON.stringify(tokens));
  const resultSets = [];
  let total = 0;
  tokens.forEach(token => {
    const dice = diceRoller.createDice(token);
    console.log("dice: " + JSON.stringify(dice));
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
  response += ` = ${total}`;
  message.reply(response);
  return true;
}

module.exports.processMessage = processMessage;