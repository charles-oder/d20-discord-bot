function include(path) {
  return require(__dirname + "/../" + path);
}

module.exports.include = include;