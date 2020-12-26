var log4js = require("log4js");

log4js.configure({
  appenders: { app: { type: "file", filename: "d20-bot.log" } },
  categories: { default: { appenders: ["app"], level: "debug" } }
});

function getLogger() {
  var logger = log4js.getLogger("app");
  return logger;
}

function debug(message) {
  getLogger().debug(message);
}

function error(message) {
  getLogger().error(message);
}

module.exports.debug = debug
module.exports.error = error;
