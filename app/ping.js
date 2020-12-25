function ping(time) {
  const timeTaken = Date.now() - time;
  return `Pong! This message had a latency of ${timeTaken}ms.`;
}

module.exports.ping = ping;
module.exports.command = "ping";