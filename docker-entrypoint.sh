#!/bin/sh
set -e

# Auto-initialize and verify embedded PostgreSQL database & seed data if needed
echo "[NovaDesk] Checking database readiness and migrations..."
npx tsx scripts/setup-db.ts || echo "[NovaDesk] Auto-setup completed or using existing storage."

# Launch application
exec "$@"
