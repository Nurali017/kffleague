#!/usr/bin/env bash
# Staging mode: prod DB dump → local PostgreSQL + prod MinIO via SSH tunnel.
# Use this to test changes against real data before pushing.
#
# What runs:
#   - Local Docker postgres (port 5433) with prod data restored
#   - SSH tunnel → prod MinIO only (ports 9000, 9001)
#   - Backend pointing to local DB + prod MinIO
#   - Frontend (port 3000) + Admin (port 3001)
#
# Usage: bash scripts/staging.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="debian@kmff.kz"
STAGING_CONTAINER="qfl-staging-db"
STAGING_PORT="5433"
STAGING_DB="qfl_staging"
STAGING_USER="postgres"
STAGING_PASS="postgres"
TUNNEL_SOCKET="/tmp/qfl-staging-tunnel.sock"

# ── Colors ────────────────────────────────────────────────────────────────────
C_TUNNEL='\033[0;36m'
C_BACKEND='\033[0;32m'
C_FRONT='\033[0;34m'
C_ADMIN='\033[0;33m'
C_DB='\033[0;31m'
C_SYS='\033[1;35m'
NC='\033[0m'

log()  { echo -e "${C_SYS}[staging]${NC} $*"; }
ok()   { echo -e "${C_SYS}[staging]${NC} ✓ $*"; }

# ── Detect Python ─────────────────────────────────────────────────────────────
PYTHON=$(command -v python3 || command -v python || true)
[ -z "$PYTHON" ] && { echo "ERROR: python3 not found."; exit 1; }

# ── Kill ports ────────────────────────────────────────────────────────────────
kill_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$pids" ]; then
    log "Port $port busy — killing..."
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

# ── Cleanup on exit ───────────────────────────────────────────────────────────
PIDS=()

cleanup() {
  echo ""
  log "Shutting down staging environment..."

  # Kill background processes
  for pid in "${PIDS[@]+"${PIDS[@]}"}"; do
    kill -9 "$pid" 2>/dev/null || true
  done

  # Close MinIO tunnel
  ssh -S "$TUNNEL_SOCKET" -O exit "$HOST" 2>/dev/null || true
  rm -f "$TUNNEL_SOCKET"

  # Remove staging DB container
  if docker ps -q -f name="$STAGING_CONTAINER" | grep -q .; then
    log "Removing staging DB container..."
    docker rm -f "$STAGING_CONTAINER" 2>/dev/null || true
  fi

  log "Done."
}

trap cleanup EXIT INT TERM

# ── Prefix output ─────────────────────────────────────────────────────────────
prefix_output() {
  local label="$1"
  local color="$2"
  shift 2
  (
    "$@" 2>&1 | while IFS= read -r line; do
      echo -e "${color}[${label}]${NC} ${line}"
    done
  ) &
  PIDS+=($!)
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — Kill existing processes on our ports
# ─────────────────────────────────────────────────────────────────────────────
kill_port 8000
kill_port 3000
kill_port 3001
kill_port 9000
kill_port 9001

# Close any existing staging tunnel
if [ -S "$TUNNEL_SOCKET" ]; then
  ssh -S "$TUNNEL_SOCKET" -O exit "$HOST" 2>/dev/null || true
  rm -f "$TUNNEL_SOCKET"
fi

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — Start local PostgreSQL container
# ─────────────────────────────────────────────────────────────────────────────
log "Starting local staging PostgreSQL on port $STAGING_PORT..."

# Remove old container if exists
docker rm -f "$STAGING_CONTAINER" 2>/dev/null || true

docker run -d \
  --name "$STAGING_CONTAINER" \
  -e POSTGRES_USER="$STAGING_USER" \
  -e POSTGRES_PASSWORD="$STAGING_PASS" \
  -e POSTGRES_DB="$STAGING_DB" \
  -p "127.0.0.1:${STAGING_PORT}:5432" \
  --health-cmd="pg_isready -U $STAGING_USER" \
  --health-interval=2s \
  --health-retries=15 \
  postgres:15-alpine \
  > /dev/null

log "Waiting for PostgreSQL to be ready..."
until docker exec "$STAGING_CONTAINER" pg_isready -U "$STAGING_USER" -q 2>/dev/null; do
  sleep 1
done
ok "PostgreSQL ready at 127.0.0.1:$STAGING_PORT"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — Open MinIO-only SSH tunnel
# ─────────────────────────────────────────────────────────────────────────────
log "Resolving MinIO container IP on $HOST..."

MINIO_IP=$(ssh "$HOST" bash <<'REMOTE'
docker inspect -f '{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' qfl-minio 2>/dev/null
REMOTE
)
MINIO_IP=$(echo "$MINIO_IP" | awk '{print $2}')

if [ -z "$MINIO_IP" ]; then
  echo "ERROR: Could not resolve qfl-minio IP. Is it running?"
  exit 1
fi
log "qfl-minio → $MINIO_IP"

ssh -M -S "$TUNNEL_SOCKET" -fN \
  -o "ExitOnForwardFailure=yes" \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -L "9000:${MINIO_IP}:9000" \
  -L "9001:${MINIO_IP}:9001" \
  "$HOST"

ok "MinIO tunnel open — api:9000 | ui:9001 (http://localhost:9001)"

# ── Ensure MinIO bucket policy ──────────────────────────────────────────────
log "Ensuring MinIO bucket policy..."
(
  cd "$ROOT/backend"
  export $(grep -v '^#' .env | grep -E '^MINIO_' | xargs)
  MINIO_ENDPOINT="127.0.0.1:9000" "$PYTHON" "$ROOT/scripts/minio-ensure-policy.py" 2>&1 | sed 's/^/  /'
) && ok "MinIO policy OK" || log "⚠ MinIO policy check failed (non-fatal)"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4 — Dump prod DB and restore locally
# ─────────────────────────────────────────────────────────────────────────────
log "Pulling prod DB dump (this may take a minute)..."

ssh "$HOST" '
  set -a
  source /home/debian/qfl/.env
  set +a
  docker exec qfl-db pg_dump \
    -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    --format=custom --no-acl --no-owner
' | docker exec -i "$STAGING_CONTAINER" \
    pg_restore -U "$STAGING_USER" -d "$STAGING_DB" \
    --no-owner --no-privileges --exit-on-error \
    2>&1 | grep -v "^pg_restore: warning" || true

ok "Prod DB restored to local staging"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4b — Run pending migrations on local staging DB
# ─────────────────────────────────────────────────────────────────────────────
log "Running alembic migrations on staging DB..."
(
  cd "$ROOT/backend"
  DATABASE_URL="postgresql+asyncpg://${STAGING_USER}:${STAGING_PASS}@127.0.0.1:${STAGING_PORT}/${STAGING_DB}?ssl=disable" \
  "$PYTHON" -m alembic upgrade heads 2>&1 | sed 's/^/  /'
) && ok "Migrations applied" || log "⚠ Some migrations failed (may be harmless if already applied)"

# ── Fetch weather for upcoming games (no Celery in staging) ──────────────────
log "Fetching weather for upcoming games..."
(
  cd "$ROOT/backend"
  DATABASE_URL="postgresql+asyncpg://${STAGING_USER}:${STAGING_PASS}@127.0.0.1:${STAGING_PORT}/${STAGING_DB}?ssl=disable" \
  "$PYTHON" -c "
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.services.weather import fetch_and_update_weather, _geocode_cache
import os

eng = create_async_engine(os.environ['DATABASE_URL'])
Session = sessionmaker(eng, class_=AsyncSession, expire_on_commit=False)

async def run():
    _geocode_cache.clear()
    async with Session() as db:
        result = await fetch_and_update_weather(db)
        await db.commit()
        print(result)
    await eng.dispose()

asyncio.run(run())
" 2>&1 | sed 's/^/  /'
) && ok "Weather fetched" || log "⚠ Weather fetch failed (non-fatal)"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5 — Start backend (local DB + prod MinIO via tunnel)
# ─────────────────────────────────────────────────────────────────────────────
log "Starting backend (port 8000)..."

# Read MinIO creds from backend/.env
MINIO_KEY=$(grep '^MINIO_ACCESS_KEY' "$ROOT/backend/.env" | cut -d= -f2)
MINIO_SECRET=$(grep '^MINIO_SECRET_KEY' "$ROOT/backend/.env" | cut -d= -f2)
MINIO_PUBLIC=$(grep '^MINIO_PUBLIC_ENDPOINT' "$ROOT/backend/.env" | cut -d= -f2)
MINIO_BUCKET=$(grep '^MINIO_BUCKET' "$ROOT/backend/.env" | cut -d= -f2)

prefix_output "backend" "$C_BACKEND" bash -c "
  cd '$ROOT/backend'
  DATABASE_URL='postgresql+asyncpg://${STAGING_USER}:${STAGING_PASS}@127.0.0.1:${STAGING_PORT}/${STAGING_DB}?ssl=disable' \
  MINIO_ENDPOINT='127.0.0.1:9000' \
  MINIO_ACCESS_KEY='$MINIO_KEY' \
  MINIO_SECRET_KEY='$MINIO_SECRET' \
  MINIO_PUBLIC_ENDPOINT='$MINIO_PUBLIC' \
  MINIO_BUCKET='$MINIO_BUCKET' \
  MINIO_SECURE='false' \
  '$PYTHON' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"

sleep 3

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6 — Start frontend + admin
# ─────────────────────────────────────────────────────────────────────────────
log "Starting frontend (port 3000)..."
rm -rf "$ROOT/qfl-website/.next"
prefix_output "front  " "$C_FRONT" \
  bash -c "cd '$ROOT/qfl-website' && npm run dev -- --port 3000"

sleep 1

log "Starting admin (port 3001)..."
rm -rf "$ROOT/qfl-admin/.next"
prefix_output "admin  " "$C_ADMIN" \
  bash -c "cd '$ROOT/qfl-admin' && npm run dev -- --port 3001"

# ─────────────────────────────────────────────────────────────────────────────
# STATUS
# ─────────────────────────────────────────────────────────────────────────────
echo ""
log "Staging environment ready:"
echo -e "  ${C_DB}[db     ]${NC} local postgres with PROD data → 127.0.0.1:$STAGING_PORT"
echo -e "  ${C_TUNNEL}[minio  ]${NC} prod MinIO via tunnel → 127.0.0.1:9000  ui:9001"
echo -e "  ${C_BACKEND}[backend]${NC} http://localhost:8000"
echo -e "  ${C_FRONT}[front  ]${NC} http://localhost:3000"
echo -e "  ${C_ADMIN}[admin  ]${NC} http://localhost:3001/admin"
echo ""
log "Press Ctrl+C to stop everything and remove staging DB."

wait
