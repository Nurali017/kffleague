#!/usr/bin/env bash
#
# QFL PostgreSQL Migration: Local Dev → Production Server
# Run from LOCAL machine: bash deploy/migrate-db.sh
#
set -euo pipefail

REMOTE_USER="debian"
REMOTE_HOST="kmff.kz"
REMOTE_DIR="/home/debian/qfl"
DUMP_FILE="qfl_db_dump_$(date +%Y%m%d_%H%M%S).sql"

echo "========================================="
echo "  QFL Database Migration"
echo "========================================="

# ---------- Step 1: Dump local database ----------
echo "[1/4] Dumping local database..."

# Find the local PostgreSQL container
DB_CONTAINER=$(docker ps --format '{{.Names}}' | grep -E '(backend.*db|qfl.*db|postgres)' | head -1)
if [ -z "$DB_CONTAINER" ]; then
    echo "ERROR: Cannot find local PostgreSQL container."
    echo "Running containers:"
    docker ps --format '{{.Names}}'
    echo ""
    echo "Start your local dev environment first, or set DB_CONTAINER manually."
    exit 1
fi
echo "Found database container: $DB_CONTAINER"

docker exec "$DB_CONTAINER" pg_dump -U postgres -d qfl_db --no-owner --no-acl > "$DUMP_FILE"
echo "Dump created: $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"

# ---------- Step 2: Compress ----------
echo "[2/4] Compressing..."
gzip "$DUMP_FILE"
echo "Compressed: ${DUMP_FILE}.gz ($(du -h "${DUMP_FILE}.gz" | cut -f1))"

# ---------- Step 3: Transfer ----------
echo "[3/4] Transferring to ${REMOTE_HOST}..."
scp "${DUMP_FILE}.gz" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

# ---------- Step 4: Restore on server ----------
echo "[4/4] Restoring on server..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -s "$DUMP_FILE" << 'REMOTE_SCRIPT'
set -e
cd /home/debian/qfl
DUMP_FILE="$1"

# Load credentials
source .env

echo "Decompressing..."
gunzip "${DUMP_FILE}.gz"

echo "Restoring database..."
docker compose -f docker-compose.prod.yml exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
cat "$DUMP_FILE" | docker compose -f docker-compose.prod.yml exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

rm "$DUMP_FILE"
echo "Database restored successfully!"
REMOTE_SCRIPT

# Cleanup local
rm -f "${DUMP_FILE}.gz"

echo ""
echo "========================================="
echo "  Database migration complete!"
echo "========================================="
