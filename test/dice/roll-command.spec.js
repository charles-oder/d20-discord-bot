var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var rollCommand = require("../../app/dice/roll-command.js");
var diceRoller = require("../../app/dice/dice-roller.js");
const sinon = require("sinon");
const fs = require("fs");
let stubRolls = [];
const docManager = require("../../app/persistance/doc-manager.js");

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
      const files = fs.readdirSync(docManager.storageDir);
      files.forEach(file => {
        if (fs.existsSync(docManager.storageDir + "/" + file)) {
          fs.unlinkSync(docManager.storageDir + "/" + file);
        }
      });
    });
    it("does not handle message witout command", function() {
      const message = { content: "1d10", author: "user" };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, false);
    });
    it("does not handle message with help command", function() {
      let reply = ""
      const message = { content: "!roll help", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, false);
      expect(reply).to.contains("Usage: !roll xdx");
    });
    it("reply to private message", function() {
      let reply = "";
      let directReply = "";
      stubRolls = [4];
      const message = { content: "!roll 1d10", member: { displayName: "user" } };
      message.channel = { type: "dm", send: function(msg){ reply = msg } };
      message.author = { send: function(msg) { directReply = msg } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).equals("");
      expect(directReply).equals("You roll 1d10: [4] = **4**");
    });
    it("handles message with command", function() {
      let reply = ""
      stubRolls = [4];
      const message = { content: "!roll 1d10", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).equals("user rolls 1d10: [4] = **4**");
    });
    it("handles complex message with command", function() {
      let reply = ""
      stubRolls = [1, 2, 3];
      const message = { content: "!roll 1d10 + 2d6 + 2", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).equals("user rolls 1d10 + 2d6 + 2: [1][2,3][2] = **8**");
    });
    it("No argument repeats last command", function() {
      let reply1 = ""
      let reply2 = ""
      stubRolls = [1, 2];
      const message1 = { content: "!roll 1d6", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };
      const message2 = { content: "!roll", member: { displayName: "user" , id: "1"}, channel: { send: function(msg){ reply2 = msg } } };

      expect(rollCommand.processMessage(message1)).to.be.true;
      expect(rollCommand.processMessage(message2)).to.be.true;
      expect(reply1).equals("user rolls 1d6: [1] = **1**");
      expect(reply2).equals("user rolls 1d6: [2] = **2**");
    });
    it("No argument repeat is user specific last command", function() {
      let reply1 = ""
      let reply2 = ""
      let reply3 = ""
      stubRolls = [1, 2, 3];
      const message1 = { content: "!roll 1d6", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };
      const message2 = { content: "!roll 1d8", member: { displayName: "other-user", id: "2" }, channel: { send: function(msg){ reply2 = msg } } };
      const message3 = { content: "!roll", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply3 = msg } } };

      expect(rollCommand.processMessage(message1)).to.be.true;
      expect(rollCommand.processMessage(message2)).to.be.true;
      expect(rollCommand.processMessage(message3)).to.be.true;
      expect(reply1).equals("user rolls 1d6: [1] = **1**");
      expect(reply2).equals("other-user rolls 1d8: [2] = **2**");
      expect(reply3).equals("user rolls 1d6: [3] = **3**");
    });
    it("No argument with no history returns help command", function() {
      let reply1 = ""
      stubRolls = [1, 2, 3];
      const message1 = { content: "!roll", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };

      expect(rollCommand.processMessage(message1)).to.be.true;
      expect(reply1).to.contains("Usage: !roll xdx");
    });
  });
});
