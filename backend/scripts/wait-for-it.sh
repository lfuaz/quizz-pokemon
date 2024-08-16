#!/bin/sh

# Host and port are passed as the first and second arguments
HOST=$1
PORT=$2
TIMEOUT=${3:-30}  # Default to 30 seconds if no timeout is provided

# Shift the first three arguments so we can capture the rest as a command
shift 3
COMMAND="$@"

# Ensure that host and port are provided
if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Usage: $0 host port [timeout] -- command"
  exit 1
fi

echo "Waiting for $HOST:$PORT for up to $TIMEOUT seconds..."

# Initialize a counter for the timeout
SECONDS=0

# Loop until the host and port become available or until the timeout is reached
while ! nc -z "$HOST" "$PORT"; do
  sleep 1
  SECONDS=$((SECONDS + 1))

  if [ "$SECONDS" -ge "$TIMEOUT" ]; then
    echo "Timeout of $TIMEOUT seconds reached, $HOST:$PORT is still not available."
    exit 1
  fi
done

echo "$HOST:$PORT is available!"

# If a command is provided after the '--', execute it
if [ -n "$COMMAND" ]; then
  echo "Executing command: $COMMAND"
  exec $COMMAND
fi
