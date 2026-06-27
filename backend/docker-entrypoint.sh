#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Ensuring default users..."
node scripts/seed-default-users.js

echo "Starting server..."
exec node dist/index.js
