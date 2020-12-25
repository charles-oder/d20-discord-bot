
const prefix = "!";

function parse(commandBody) {
  console.log(`Command Body: '${commandBody}'`);
  if (!commandBody.includes(" ")) {
    return { command: commandBody, args: "" };
  }
  const command = commandBody.substr(0,commandBody.indexOf(' '));
  console.log(`Command: '${command}'`);
  const args = commandBody.substr(commandBody.indexOf(' ') + 1);
  console.log(`Args: '${args}'`);

  return { command: command, args: args };
}

const commandList = [
  "ping"
];

module.exports.prefix = prefix;
module.exports.parse = parse;
module.exports.commandList = commandList;