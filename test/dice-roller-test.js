var assert = require('assert');
var diceRoller = require("../app/dice/dice-roller.js");

describe("DiceRoller", function() {
  describe("tokenize", function() {
    it("1d10 returns single 1d10", function() {
      const diceString = "1d10";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10"]);
    });
    it("1d10+2d6 returns 2 tokens", function() {
      const diceString = "1d10+2d6";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10", "2d6"]);
    });
    it("1d10 + 2d6 returns 2 tokens", function() {
      const diceString = "1d10 + 2d6";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10", "2d6"]);
    });
    it("1d10 + 2d6 + 2 returns 3 tokens", function() {
      const diceString = "1d10 + 2d6 + 2";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10", "2d6", "2"]);
    });
    it("1d10 + 2d6 - 2 returns 3 tokens with a negative mod", function() {
      const diceString = "1d10 + 2d6 - 2";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10", "2d6", "-2"]);
    });
    it("1d10 - 1d6 subtracts dice", function() {
      const diceString = "1d10 - 1d6";
      const tokens = diceRoller.tokenize(diceString);

      assert.deepStrictEqual(tokens, ["1d10", "-1d6"]);
    });
  });
  describe("createDice", function() {
    it("1d10 returns single d10", function() {
      const token = "1d10";
      const dice = diceRoller.createDice(token);

      assert.deepStrictEqual(["d10"], dice.dice);
      assert.deepStrictEqual(dice.mods, []);
    });
    it("2d10 returns two d10s", function() {
      const token = "2d10";
      const dice = diceRoller.createDice(token);

      assert.deepStrictEqual(["d10", "d10"], dice.dice);
      assert.deepStrictEqual(dice.mods, []);
    });
    it("5d6h3 returns two 5 dice with high-3 for keep", function() {
      const token = "5d6h3";
      const dice = diceRoller.createDice(token);

      assert.deepStrictEqual(["d6", "d6", "d6", "d6", "d6"], dice.dice);
      assert.deepStrictEqual(dice.mods, ["high-3"]);
    });
    it("5d6l3 returns two 5 dice with low-3 for keep", function() {
      const token = "5d6l3";
      const dice = diceRoller.createDice(token);

      assert.deepStrictEqual(["d6", "d6", "d6", "d6", "d6"], dice.dice);
      assert.deepStrictEqual(dice.mods, ["low-3"]);
    });
  });
});
