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
  let keep = "all";
  let diceString = token;

  const keepHigh = token.split("h");
  if (keepHigh[1]) {
    keep = "high-" + keepHigh[1];
    diceString = keepHigh[0];
  }

  const keepLow = token.split("l");
  if (keepLow[1]) {
    keep = "low-" + keepLow[1];
    diceString = keepLow[0];
  }

  const components = diceString.split("d");
  const count = components[0];
  const sides = components[1];
  const dice = Array(parseInt(count)).fill("d" + sides);
  
  return { dice: dice, keep: keep };
}

module.exports.tokenize = tokenize;
module.exports.createDice = createDice;