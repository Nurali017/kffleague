#!/usr/bin/env bash
#
# QFL Deploy Script
# Usage:
#   bash deploy/deploy.sh              # Standard deployment
#   bash deploy/deploy.sh --initial    # First-time deployment
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE="docker compose -f $PROJECT_DIR/docker-compose.prod.yml"
KAISAR_DIR="/opt/kaisar"
INITIAL=false

if [[ "${1:-}" == "--initial" ]]; then
    INITIAL=true
fi

cd "$PROJECT_DIR"

if [ ! -f .env ]; then
    echo "ERROR: .env not found. Copy .env.production.example to .env first."
    exit 1
fi

echo "========================================="
echo "  QFL Deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# ---------- Pull ----------
echo "[1/7] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# ---------- Build ----------
echo "[2/7] Building Docker images..."
$COMPOSE build --parallel

# ---------- Infrastructure ----------
echo "[3/7] Starting infrastructure..."
$COMPOSE up -d db redis minio

echo "Waiting for database..."
for i in $(seq 1 30); do
    if $COMPOSE exec -T db pg_isready -U "$(grep POSTGRES_USER .env | cut -d= -f2)" > /dev/null 2>&1; then
        echo "Database ready."
        break
    fi
    [ $i -eq 30 ] && echo "ERROR: Database not ready." && exit 1
    sleep 2
done

# ---------- Migrations ----------
echo "[4/7] Running migrations..."
$COMPOSE run --rm backend alembic upgrade head
echo "Migrations complete."

# ---------- Application ----------
echo "[5/7] Starting application services..."

$COMPOSE up -d backend
echo "Waiting for backend..."
for i in $(seq 1 30); do
    if $COMPOSE exec -T backend curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo "Backend healthy."
        break
    fi
    [ $i -eq 30 ] && echo "ERROR: Backend health check failed." && $COMPOSE logs --tail=30 backend && exit 1
    sleep 2
done

$COMPOSE up -d frontend
sleep 10

$COMPOSE up -d celery_worker celery_beat

# ---------- Nginx config ----------
echo "[6/7] Updating nginx config..."
cp "$PROJECT_DIR/nginx/conf.d/default.conf" "$KAISAR_DIR/nginx/conf.d/kff.conf"
docker exec kaisar-nginx nginx -t && docker exec kaisar-nginx nginx -s reload
echo "Nginx reloaded."

# ---------- Verify ----------
echo "[7/7] Verifying..."
$COMPOSE ps

echo ""
echo "========================================="
echo "  Deployment complete!"
echo "========================================="

if [ "$INITIAL" = true ]; then
    echo ""
    echo "Running initial data sync..."
    $COMPOSE exec -T celery_worker celery -A app.tasks call app.tasks.sync_tasks.full_sync
    echo "Sync queued. Monitor: $COMPOSE logs -f celery_worker"
fi
