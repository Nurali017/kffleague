#!/usr/bin/env bash
#
# QFL Media Worker Deploy Script
# Usage:
#   bash deploy/deploy-media.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/docker-compose.media.yml" ]; then
    PROJECT_DIR="$SCRIPT_DIR"
else
    PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
fi
COMPOSE="docker compose --env-file $PROJECT_DIR/.env.media -f $PROJECT_DIR/docker-compose.media.yml"

cd "$PROJECT_DIR"

if [ ! -f .env.media ]; then
    echo "ERROR: .env.media not found. Copy .env.media.example to .env.media first."
    exit 1
fi

set -a
. "$PROJECT_DIR/.env.media"
set +a

echo "========================================="
echo "  QFL Media Worker Deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

if [ ! -d "${MEDIA_SECRETS_DIR:-./secrets-media}" ]; then
    echo "ERROR: secrets directory ${MEDIA_SECRETS_DIR:-./secrets-media} not found."
    echo "Create it and place the Google service account file there before deploy."
    exit 1
fi

echo "[1/3] Pulling latest media worker image..."
$COMPOSE pull media_worker

echo "[2/3] Starting media worker..."
$COMPOSE up -d media_worker

echo "[3/3] Verifying..."
$COMPOSE ps

echo ""
echo "Media worker is up."
echo "Tail logs with:"
echo "  $COMPOSE logs -f media_worker"
