#!/bin/bash
LOG_DIR="/tmp/logs"
LOG_FILE="/tmp/logs/d20-bot.log"
PROCESS_NAME="app/index.js"
mkdir -p /tmp
mkdir -p $LOG_DIR

kill_app() {
  echo "stopping bot"
  PID=$(ps -axf | pgrep -f index.js)
  if [[ ! -z $PID ]]; then
    kill -9 $PID
  else
    echo "Bot wasn't running"
  fi
}

if [[ $1 == "stop" ]]; then
  kill_app
fi
if [[ $1 == "start" ]]; then
  kill_app
  echo "starting bot"
  node $PROCESS_NAME >> $LOG_FILE&
fi
