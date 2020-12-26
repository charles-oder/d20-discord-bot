function tokenize(dieString) {
  const trimmed = dieString.replace(/ /g, "");
  const components = trimmed.replace(/-/g, "+-").split("+");

  return components;
  // xdx // normal die
  // xdx + xdx // added dice
  // xdx + n // dice plus modifier
  // xdxhx // dice keeping highest x
  // xdxlx // dice keeping lowest x
  // -<anything> // subtract value
}
function createDice(token) {
  let diceString = token;
  const  mods = []

  const keepHigh = token.split("h");
  if (keepHigh[1]) {
    mods.push("high-" + keepHigh[1]);
    diceString = keepHigh[0];
  }

  const keepLow = token.split("l");
  if (keepLow[1]) {
    mods.push("low-" + keepLow[1]);
    diceString = keepLow[0];
  }

  if (diceString.includes("d")) {
    const components = diceString.split("d");
    const count = components[0];
    const sides = components[1];
    const dice = Array(parseInt(count)).fill("d" + sides);
    return { dice: dice, mods: mods };
  }
  return {dice: [diceString], mods: mods };
}

function roll(sides) {
  return 1 + Math.floor(Math.random() * sides);
}

function rollString(str) {
  if (str.startsWith('d')) {
    const sides = parseInt(str.replace("d", ""));
    return roll(sides);
  }
  return parseInt(str);
}

module.exports.tokenize = tokenize;
module.exports.createDice = createDice;
module.exports.rollString = rollString;