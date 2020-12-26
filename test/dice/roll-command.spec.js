var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var rollCommand = require("../../app/dice/roll-command.js");
var diceRoller = require("../../app/dice/dice-roller.js");
const sinon = require("sinon");
let stubRolls = [];

describe("RollCommand", function() {
  describe("processMessage()", function() {
    beforeEach(function() {
      sinon.stub(diceRoller, "roll").callsFake(function(sides) {
        return stubRolls.shift();
      });
    })
    afterEach(function() {
      stubRolls = [];
      diceRoller.roll.restore();
    });
    it("does not handle message witout command", function() {
      const message = { content: "1d10", author: "user" };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, false);
    });
    it("does not handle message with help command", function() {
      let reply = ""
      const message = { content: "!roll help", author: { username: "user" }, reply: function(msg){ reply = msg } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, false);
      expect(reply).to.contains("Usage: !roll xdx");
    });
    it("handles message with command", function() {
      let reply = ""
      stubRolls = [4];
      const message = { content: "!roll 1d10", author: { username: "user" }, reply: function(msg){ reply = msg } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).equals("user rolls 1d10: [4] = 4");
    });
    it("handles complex message with command", function() {
      let reply = ""
      stubRolls = [1, 2, 3];
      const message = { content: "!roll 1d10 + 2d6 + 2", author: { username: "user" }, reply: function(msg){ reply = msg } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).equals("user rolls 1d10 + 2d6 + 2: [1][2,3][2] = 8");
    });
  });
});
