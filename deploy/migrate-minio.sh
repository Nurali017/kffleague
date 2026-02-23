#!/usr/bin/env bash
#
# QFL MinIO Migration: Local Dev → Production Server
# Run from LOCAL machine: bash deploy/migrate-minio.sh
#
set -euo pipefail

REMOTE_USER="debian"
REMOTE_HOST="kmff.kz"
REMOTE_DIR="/home/debian/qfl"
ARCHIVE_FILE="minio_data_$(date +%Y%m%d_%H%M%S).tar.gz"

echo "========================================="
echo "  QFL MinIO Data Migration"
echo "========================================="

# ---------- Step 1: Export local MinIO data ----------
echo "[1/3] Exporting MinIO data from local Docker volume..."

# Find the MinIO data volume
VOLUME_NAME=$(docker volume ls --format '{{.Name}}' | grep -i minio | head -1)
if [ -z "$VOLUME_NAME" ]; then
    echo "ERROR: Cannot find MinIO data volume."
    echo "Available volumes:"
    docker volume ls --format '{{.Name}}'
    echo ""
    echo "Set VOLUME_NAME manually and re-run."
    exit 1
fi
echo "Found volume: $VOLUME_NAME"

docker run --rm \
    -v "${VOLUME_NAME}:/data:ro" \
    -v "$(pwd):/backup" \
    alpine tar czf "/backup/${ARCHIVE_FILE}" -C /data .

echo "Archive created: ${ARCHIVE_FILE} ($(du -h "${ARCHIVE_FILE}" | cut -f1))"

# ---------- Step 2: Transfer ----------
echo "[2/3] Transferring to ${REMOTE_HOST}..."
rsync -avz --progress "${ARCHIVE_FILE}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

# ---------- Step 3: Restore on server ----------
echo "[3/3] Restoring on server..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -s "$ARCHIVE_FILE" << 'REMOTE_SCRIPT'
set -e
cd /home/debian/qfl
ARCHIVE_FILE="$1"

# Ensure MinIO container is running
docker compose -f docker-compose.prod.yml up -d minio
sleep 5

# Find the server's MinIO volume
VOLUME=$(docker volume ls --format '{{.Name}}' | grep -i minio | head -1)
if [ -z "$VOLUME" ]; then
    echo "ERROR: Cannot find MinIO volume on server."
    exit 1
fi
echo "Restoring to volume: $VOLUME"

# Restore data
docker run --rm \
    -v "${VOLUME}:/data" \
    -v "$(pwd):/backup" \
    alpine sh -c "cd /data && tar xzf /backup/${ARCHIVE_FILE}"

# Restart MinIO to pick up new data
docker compose -f docker-compose.prod.yml restart minio
sleep 5

rm "$ARCHIVE_FILE"
echo "MinIO data restored successfully!"
REMOTE_SCRIPT

# Cleanup local
rm -f "${ARCHIVE_FILE}"

echo ""
echo "========================================="
echo "  MinIO migration complete!"
echo "========================================="
