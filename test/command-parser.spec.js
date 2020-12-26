const include = require("./include.js");
const commandParser = include.include("app/command-parser.js")
var assert = require('assert');

describe("Command Parser", function() {
  it("'!ping' without space returns ping command with no args", function() {
    const message = "!ping";
    const command = commandParser.parse(message);
    assert.equal("ping", command.command)
    assert.equal(undefined, command.args);
  });
  it("'!ping test one two' returns ping command with args", function() {
    const message = "!ping test one two";
    const command = commandParser.parse(message);
    assert.equal("ping", command.command)
    assert.equal("test one two", command.args);
  });
  it("'!roll 1d20' returns roll command with args", function() {
    const message = "!roll 1d20";
    const command = commandParser.parse(message);
    assert.equal("roll", command.command)
    assert.equal("1d20", command.args);
  });
});
