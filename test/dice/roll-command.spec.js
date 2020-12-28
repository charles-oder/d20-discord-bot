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
      const message = { content: "1d10", author: { displayName: "user" } };
      const response = rollCommand.processMessage(message);

      expect(response).to.be.undefined;
    });
    it("does not handle message with help command", function() {
      let reply = ""
      const message = { content: "!roll help", author: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      expect(response.replaceRequest).to.be.false;
      expect(response.message).to.contains("Usage: !roll xdx");
    });
    it("reply to private message", function() {
      let reply = "";
      let directReply = "";
      stubRolls = [4];
      const message = { content: "!roll 1d10", author: { displayName: "user" } };
      message.channel = { type: "dm", send: function(msg){ reply = msg } };
      message.author = { send: function(msg) { directReply = msg } };
      const response = rollCommand.processMessage(message);

      expect(response.replaceRequest).to.be.true;
      expect(response.message).equals("You roll 1d10: [4] = **4**");
    });
    it("handles message with command", function() {
      let reply = ""
      stubRolls = [4];
      const message = { content: "!roll 1d10", author: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      expect(response.replaceRequest).to.be.true;
      expect(response.message).equals("user rolls 1d10: [4] = **4**");
    });
    it("handles complex message with command", function() {
      stubRolls = [1, 2, 3];
      const message = { content: "!roll 1d10 + 2d6 + 2", author: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = rollCommand.processMessage(message);

      expect(response.replaceRequest).to.be.true;
      expect(response.message).equals("user rolls 1d10 + 2d6 + 2: [1][2,3][2] = **8**");
    });
    it("No argument repeats last command", function() {
      stubRolls = [1, 2];
      const message1 = { content: "!roll 1d6", author: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };
      const message2 = { content: "!roll", author: { displayName: "user" , id: "1"}, channel: { send: function(msg){ reply2 = msg } } };

      let reply1  = rollCommand.processMessage(message1);
      let reply2  = rollCommand.processMessage(message2);

      expect(reply1.replaceRequest).to.be.true;
      expect(reply2.replaceRequest).to.be.true;
      expect(reply1.message).equals("user rolls 1d6: [1] = **1**");
      expect(reply2.message).equals("user rolls 1d6: [2] = **2**");
    });
    it("No argument repeat is user specific last command", function() {
      stubRolls = [1, 2, 3];
      const message1 = { content: "!roll 1d6", author: { displayName: "user", id: "1" }, channel: { } };
      const message2 = { content: "!roll 1d8", author: { displayName: "other-user", id: "2" }, channel: { } };
      const message3 = { content: "!roll", author: { displayName: "user", id: "1" }, channel: { } };

      let reply1 = rollCommand.processMessage(message1);
      let reply2 = rollCommand.processMessage(message2);
      let reply3 = rollCommand.processMessage(message3);

      expect(reply1.replaceRequest).to.be.true;
      expect(reply2.replaceRequest).to.be.true;
      expect(reply3.replaceRequest).to.be.true;
      expect(reply1.message).equals("user rolls 1d6: [1] = **1**");
      expect(reply2.message).equals("other-user rolls 1d8: [2] = **2**");
      expect(reply3.message).equals("user rolls 1d6: [3] = **3**");
    });
    it("No argument with no history returns help command", function() {
      let reply1 = ""
      stubRolls = [1, 2, 3];
      const message1 = { content: "!roll", author: { displayName: "user", id: "1" }, channel: {}};

      let reply = rollCommand.processMessage(message1);

      expect(reply.replaceRequest).to.be.true;
      expect(reply.message).to.contains("Usage: !roll xdx");
    });
  });
});
