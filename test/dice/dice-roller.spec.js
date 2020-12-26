const include = require("../include.js");
var assert = require("assert");
const chai = require("chai");
const expect = chai.expect;
var diceRoller = include.include("app/dice/dice-roller.js");

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
    it("5 returns 5", function() {
      const token = "5";
      const dice = diceRoller.createDice(token);

      assert.deepStrictEqual(dice.dice, ["5"]);
      assert.deepStrictEqual(dice.mods, []);
    });
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
  describe("rollString", function() {
    it("2 returns 2", function() {
      const die = "2";
      const roll = diceRoller.rollString(die);

      assert.deepStrictEqual(roll, 2);
    });
    it("d6 always rolls 1-6", () => {
      for (let i = 0; i < 100; i++) {
        const actualValue = diceRoller.rollString("d6");

        expect(actualValue >= 1);
        expect(actualValue <= 6);
      }
    });
    it("d6 rolls variety of 1-6", () => {
      const counts = new Array(6).fill(0);

      let maxRoll = 0;
      let minRoll = 20;
      for (let i = 0; i < 1000000; i++) {
        const actualValue = diceRoller.rollString("d6");
        maxRoll = Math.max(maxRoll, actualValue);
        minRoll = Math.min(minRoll, actualValue);
        counts[actualValue - 1]++;
      }
      let maxCount = 0;
      let minCount = Number.MAX_SAFE_INTEGER;
      counts.forEach(e => {
        maxCount = Math.max(maxCount, e);
        minCount = Math.min(minCount, e);
      });
      expect(maxRoll).to.equal(6);
      expect(minRoll).to.equal(1);
      expect(maxCount / minCount).to.lessThan(1.03);
      expect(maxCount / minCount).to.greaterThan(0.98);
    });
    it("d20 rolls variety of 1-20", () => {
      const counts = new Array(20).fill(0);

      let maxRoll = 0;
      let minRoll = 20;
      for (let i = 0; i < 1000000; i++) {
        const actualValue = diceRoller.rollString("d20");
        maxRoll = Math.max(maxRoll, actualValue);
        minRoll = Math.min(minRoll, actualValue);
        counts[actualValue - 1]++;
      }
      let maxCount = 0;
      let minCount = Number.MAX_SAFE_INTEGER;

      counts.forEach(e => {
        maxCount = Math.max(maxCount, e);
        minCount = Math.min(minCount, e);
      });
      expect(maxRoll).to.equal(20);
      expect(minRoll).to.equal(1);
      expect(maxCount / minCount).to.lessThan(1.03);
      expect(maxCount / minCount).to.greaterThan(0.98);
    });
  });
});
