#!/bin/bash

# Replace placeholders with environment variable values
envsubst < /docker-entrypoint-initdb.d/init.sql.template > /docker-entrypoint-initdb.d/init.sql

# Execute the SQL script
exec "$@"