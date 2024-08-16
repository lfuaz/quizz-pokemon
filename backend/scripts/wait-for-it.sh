#!/usr/bin/env bash

HOST=$1
PORT=$2
TIMEOUT=30  # Default to 30 seconds if no timeout is provided

# Optional: Allow timeout to be specified as the third argument
if [ -n "$3" ]; then
  TIMEOUT=$3
fi

shift 3  # Remove the first three arguments (host, port, and optional timeout)
COMMAND=("$@")  # Capture the remaining arguments as the command

# Check if host and port are provided
if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Usage: $0 host port [timeout] -- command"
  exit 1
fi

echo "Waiting for $HOST:$PORT for up to $TIMEOUT seconds..."

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

# Execute the command after waiting
if [ "${#COMMAND[@]}" -gt 0 ]; then
  echo "Executing command: ${COMMAND[*]}"
  exec "${COMMAND[@]}"
fi