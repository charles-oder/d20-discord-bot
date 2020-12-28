var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var attackCommand = require("../../app/dice/attack-command.js");
var diceRoller = require("../../app/dice/dice-roller.js");
const sinon = require("sinon");
let stubRolls = [];
const fs = require("fs");
const docManager = require("../../app/persistance/doc-manager.js");

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
      const files = fs.readdirSync(docManager.storageDir);
      files.forEach(file => {
        if (fs.existsSync(docManager.storageDir + "/" + file)) {
          fs.unlinkSync(docManager.storageDir + "/" + file);
        }
      });
    
    });
    it("does not handle message witout command", function() {
      const message = { content: "monkey", author: "user" };
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, false);
    });
    it("help command", function() {
      let reply = "";
      const message = { content: "!attack help", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, false);
      expect(reply).to.contains("Usage: !attack +x/+x... [options]");
    });
    it("single attack", function() {
      let reply = "";
      const message = { content: "!attack +1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [15];
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).to.equals("user attacks! Roll: 15 + 1 = **16**\n");
    });
    it("Reply to DM", function() {
      let reply = "";
      let dmReply = "";
      const message = { content: "!attack +1", member: { displayName: "user" } };
      message.channel = { type: "dm", send: function(msg){ reply = msg } };
      message.author = { send: function(msg){ dmReply = msg } }
      stubRolls = [15];
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      expect(reply).to.equals("");
      expect(dmReply).to.equals("You attack! Roll: 15 + 1 = **16**\n");
    });
    it("full attack", function() {
      let reply = "";
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
      let reply = "";
      const message = { content: "!attack +6/+1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 20, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 20 + 1 = **21**, *Critical Threat* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with natural 1 fumble threat", function() {
      let reply = "";
      const message = { content: "!attack +6/+1", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 1, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 1 + 1 = **2**, *Fumble* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with natural 19 crit threat", function() {
      let reply = "";
      const message = { content: "!attack +6/+1 crit:19", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 19, 12]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 19 + 1 = **20**, *Critical Threat* Backup Roll: 12 + 1 = **13**\n"
      expect(reply).to.equals(expected);
    });
    it("full with fumble disabled", function() {
      let reply = "";
      const message = { content: "!attack +6/+1 fumble:0", member: { displayName: "user" }, channel: { send: function(msg){ reply = msg } } };
      stubRolls = [10, 1]
      const response = attackCommand.processMessage(message);

      assert.strictEqual(response, true);
      let expected = "user attacks! Roll: 10 + 6 = **16**\n"
      expected += "user attacks! Roll: 1 + 1 = **2**\n"
      expect(reply).to.equals(expected);
    });
    it("No argument repeats last command", function() {
      let reply1 = ""
      let reply2 = ""
      stubRolls = [10, 12];
      const message1 = { content: "!attack +1", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };
      const message2 = { content: "!attack", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply2 = msg } } };

      expect(attackCommand.processMessage(message1)).to.be.true;
      expect(attackCommand.processMessage(message2)).to.be.true;
      expect(reply1).equals("user attacks! Roll: 10 + 1 = **11**\n");
      expect(reply2).equals("user attacks! Roll: 12 + 1 = **13**\n");
    });
    it("No argument repeat is user specific last command", function() {
      let reply1 = ""
      let reply2 = ""
      let reply3 = ""
      stubRolls = [11, 12, 13];
      const message1 = { content: "!attack +1", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };
      const message2 = { content: "!attack +2", member: { displayName: "other-user", id: "2" }, channel: { send: function(msg){ reply2 = msg } } };
      const message3 = { content: "!attack", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply3 = msg } } };

      expect(attackCommand.processMessage(message1)).to.be.true;
      expect(attackCommand.processMessage(message2)).to.be.true;
      expect(attackCommand.processMessage(message3)).to.be.true;
      expect(reply1).equals("user attacks! Roll: 11 + 1 = **12**\n");
      expect(reply2).equals("other-user attacks! Roll: 12 + 2 = **14**\n");
      expect(reply3).equals("user attacks! Roll: 13 + 1 = **14**\n");
    });
    it("No argument with no history returns help command", function() {
      let reply1 = ""
      stubRolls = [11, 12, 13];
      const message1 = { content: "!attack", member: { displayName: "user", id: "1" }, channel: { send: function(msg){ reply1 = msg } } };

      expect(attackCommand.processMessage(message1)).to.be.true;
      expect(reply1).to.contains("Usage: !attack +x/+x... [options]");
    });

  });
});
