const include = require("../include.js");
var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var rollCommand = include.include("app/dice/roll-command.js");

describe("RollCommand", function() {
  describe("processMessage()", function() {
    it("1d10", function() {
      const message = { content: "1d10", author: "user" };
      const response = rollCommand.processMessage(message);

      assert.deepStrictEqual(tokens, "");
    });
  });
});
