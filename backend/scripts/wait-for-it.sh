#!/usr/bin/env bash

HOST=$1
PORT=$2
TIMEOUT=${3:-30}  # Default timeout of 30 seconds if not provided

shift 2  # Shift the first two arguments (HOST and PORT) out of the list
COMMAND=("$@")  # Store the remaining arguments as a command array

# Check if host and port are provided
if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Usage: $0 host port [timeout] -- command"
  exit 1
fi

echo "Waiting for $HOST:$PORT to be available..."

SECONDS=0

while ! nc -z $HOST $PORT; do
  sleep 1
  ELAPSED=$SECONDS

  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "Timeout of $TIMEOUT seconds reached, $HOST:$PORT is still not available."
    exit 1
  fi
done

echo "$HOST:$PORT is available!"

# If there is a command provided after '--', execute it
if [ "${#COMMAND[@]}" -gt 0 ]; then
  echo "Executing command: ${COMMAND[*]}"
  exec "${COMMAND[@]}"
fi
