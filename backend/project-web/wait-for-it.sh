#!/usr/bin/env bash

host="$1"
shift

echo "Waiting for $host:3306..."

until (echo > /dev/tcp/$host/3306) >/dev/null 2>&1; do
  echo "MySQL is not ready yet..."
  sleep 2
done

echo "MySQL is ready!"
exec "$@"