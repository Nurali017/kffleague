#!/usr/bin/env bash
# Runs tunnel + backend + frontend + admin in ONE terminal.
# Each service output is prefixed with a colored label.
# Ctrl+C stops everything.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ── Colors ───────────────────────────────────────────────────────────────────
C_TUNNEL='\033[0;36m'   # cyan
C_BACKEND='\033[0;32m'  # green
C_FRONT='\033[0;34m'    # blue
C_ADMIN='\033[0;33m'    # yellow
C_SYS='\033[1;35m'      # magenta (system messages)
NC='\033[0m'

log() { echo -e "${C_SYS}[dev]${NC} $*"; }

# ── Detect Python ─────────────────────────────────────────────────────────────
PYTHON=$(command -v python3 || command -v python || true)
if [ -z "$PYTHON" ]; then
  echo "ERROR: python3 not found. Install Python 3 first."
  exit 1
fi

# ── Kill local ports before start ────────────────────────────────────────────
kill_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    log "Port $port busy (PID $pids) — killing..."
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
}

kill_port 8000
kill_port 3000
kill_port 3001

# ── Prefix output of a background command ────────────────────────────────────
PIDS=()

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

# ── Cleanup ───────────────────────────────────────────────────────────────────
cleanup() {
  echo ""
  log "Shutting down all services..."
  ssh -S /tmp/qfl-dev-tunnel.sock -O exit debian@kmff.kz 2>/dev/null || true
  for pid in "${PIDS[@]}"; do
    kill -9 "$pid" 2>/dev/null || true
  done
  for port in 5435 6379 9000 9001 8000 3000 3001; do
    pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
    [ -n "$pids" ] && echo "$pids" | xargs kill -9 2>/dev/null || true
  done
  log "Done."
}

trap cleanup EXIT INT TERM

# ── 1. Tunnel ─────────────────────────────────────────────────────────────────
log "Starting SSH tunnels..."
prefix_output "tunnel " "$C_TUNNEL" bash "$ROOT/scripts/dev-tunnel.sh"

log "Waiting for tunnels..."
sleep 4

# ── 2. Backend ───────────────────────────────────────────────────────────────
# Override DATABASE_URL to point at prod DB via SSH tunnel (port 5435)
export DATABASE_URL="postgresql+asyncpg://qfl_user:Qfl2026SecureProd@127.0.0.1:5435/qfl_db"

log "Starting backend (port 8000) using $PYTHON..."
prefix_output "backend" "$C_BACKEND" \
  bash -c "cd '$ROOT/backend' && '$PYTHON' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

sleep 2

# ── 3. Frontend ───────────────────────────────────────────────────────────────
log "Starting frontend (port 3000)..."
rm -rf "$ROOT/qfl-website/.next"
prefix_output "front  " "$C_FRONT" \
  bash -c "cd '$ROOT/qfl-website' && npm run dev -- --port 3000"

sleep 1

# ── 4. Admin ──────────────────────────────────────────────────────────────────
log "Starting admin (port 3001)..."
rm -rf "$ROOT/qfl-admin/.next"
prefix_output "admin  " "$C_ADMIN" \
  bash -c "cd '$ROOT/qfl-admin' && npm run dev -- --port 3001"

# ── Status ────────────────────────────────────────────────────────────────────
echo ""
log "All services started:"
echo -e "  ${C_TUNNEL}[tunnel ]${NC} postgres:5435 | redis:6379 | minio:9000"
echo -e "  ${C_BACKEND}[backend]${NC} http://localhost:8000"
echo -e "  ${C_FRONT}[front  ]${NC} http://localhost:3000"
echo -e "  ${C_ADMIN}[admin  ]${NC} http://localhost:3001/admin"
echo ""
log "Press Ctrl+C to stop all."

wait
