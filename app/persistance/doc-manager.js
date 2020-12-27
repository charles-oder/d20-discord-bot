const fs = require("fs");
const log = require("../log.js");
const storageDir = "/tmp/d20-bot-data"

function createDocDirectoryIfNeeded() {
  if (!fs.existsSync("/tmp")){
    fs.mkdirSync("/tmp");
  }
  if (!fs.existsSync(storageDir)){
    fs.mkdirSync(storageDir);
  }
}

function loadDocument(key) {
  const documentPath = `${storageDir}/${key}.json`;
  if (!fs.existsSync(documentPath)) {
    return {};
  }
  const data = fs.readFileSync(documentPath);
  if (data) {
    return JSON.parse(data);
  }
  return {}

}

function saveDocument(key, obj) {
  createDocDirectoryIfNeeded();
  const documentPath = `${storageDir}/${key}.json`;
  fs.writeFileSync(documentPath, JSON.stringify(obj));
}

module.exports.loadDocument = loadDocument;
module.exports.saveDocument = saveDocument;
module.exports.storageDir = storageDir;