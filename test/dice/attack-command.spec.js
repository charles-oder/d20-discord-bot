var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var attackCommand = require("../../app/dice/attack-command.js");
var diceRoller = require("../../app/dice/dice-roller.js");
const sinon = require("sinon");
let stubRolls = [];

describe("AttackCommand", function() {
  describe("processMessage()", function() {
    beforeEach(function() {
      sinon.stub(diceRoller, "roll").callsFake(function(sides) {
        return stubRolls.shift();
      });
    })
    afterEach(function() {
      stubRolls = [];
      diceRoller.roll.restore();
      attackCommand.history = {};
    });
    it("does not handle message witout command", function() {
      const message = { content: "monkey", author: "user" };
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, false);
    });
    it("help command", function() {
      const message = { content: "!attack help", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, false);
      expect(reply).to.contains("Usage: !attack +x/+x... [options]");
    });
    it("single attack", function() {
      const message = { content: "!attack +1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [15];
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).to.equals("user attacks! Roll: 15 + 1 = **16**\n");
    });
    it("full attack", function() {
      const message = { content: "!attack +6/+6/+1/+1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 11, 12, 13]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 11 + 6 = **17**\n"
      expected += "user attacks! Roll: 12 + 1 = **13**\n"
      expected += "user attacks! Roll: 13 + 1 = **14**\n"
      expect(reply).to.equals(expected);
    });
    it("full with natural 20 crit threat", function() {
      const message = { content: "!attack +6/+1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 20, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 20 + 1 = **21**, *Critical Threat* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with natural 1 fumble threat", function() {
      const message = { content: "!attack +6/+1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 1, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 1 + 1 = **2**, *Fumble* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with natural 19 crit threat", function() {
      const message = { content: "!attack +6/+1 crit:19", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 19, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 19 + 1 = **20**, *Critical Threat* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with fumble disabled", function() {
      const message = { content: "!attack +6/+1 fumble:0", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 1]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 1 + 1 = **2**\n"
      expect(reply).to.equals(expected);
    });
  });
});
