#!/usr/bin/env bash
# Opens SSH tunnels to production Docker containers for local development.
# Auto-reconnects when prod deploys (container IPs change on restart).
#
# Local ports:
#   5435 → qfl-db:5432    (postgres)
#   6379 → qfl-redis:6379 (redis)
#   9000 → qfl-minio:9000 (minio api)
#   9001 → qfl-minio:9001 (minio ui — http://localhost:9001)
#
# Usage: bash scripts/dev-tunnel.sh

set -euo pipefail

HOST="${TUNNEL_HOST:-debian@kmff.kz}"
SOCKET="/tmp/qfl-dev-tunnel.sock"
RECONNECT_DELAY=5

# ── Kill any leftover tunnel ─────────────────────────────────────────────────
kill_existing() {
  if [ -S "$SOCKET" ]; then
    ssh -S "$SOCKET" -O exit "$HOST" 2>/dev/null || true
    rm -f "$SOCKET"
    sleep 1
  fi

  for port in 5435 6379 9000 9001; do
    pid=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "$pid" ]; then
      echo "→ Local port $port busy (PID $pid) — killing..."
      kill "$pid" 2>/dev/null || true
      sleep 1
    fi
  done
}

cleanup() {
  echo ""
  echo "→ Shutting down tunnels..."
  ssh -S "$SOCKET" -O exit "$HOST" 2>/dev/null || true
  rm -f "$SOCKET"
  echo "→ Done."
  exit 0
}

trap cleanup EXIT INT TERM

kill_existing

# ── Connect once (resolve IPs + open tunnel) ─────────────────────────────────
connect() {
  # Kill previous tunnel if any
  if [ -S "$SOCKET" ]; then
    ssh -S "$SOCKET" -O exit "$HOST" 2>/dev/null || true
    rm -f "$SOCKET"
    sleep 1
  fi

  echo "→ Resolving container IPs on $HOST ..."

  IPS=$(ssh "$HOST" bash <<'REMOTE'
docker inspect -f '{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' \
  qfl-db qfl-redis qfl-minio 2>/dev/null
REMOTE
)

  PG_IP=$(echo "$IPS"    | awk '/\/qfl-db/    {print $2}')
  REDIS_IP=$(echo "$IPS" | awk '/\/qfl-redis/ {print $2}')
  MINIO_IP=$(echo "$IPS" | awk '/\/qfl-minio/ {print $2}')

  if [ -z "$PG_IP" ] || [ -z "$REDIS_IP" ] || [ -z "$MINIO_IP" ]; then
    echo "✗ Could not resolve container IPs (containers may be restarting)"
    echo "  qfl-db:    '${PG_IP:-missing}'"
    echo "  qfl-redis: '${REDIS_IP:-missing}'"
    echo "  qfl-minio: '${MINIO_IP:-missing}'"
    return 1
  fi

  echo "  qfl-db    → $PG_IP"
  echo "  qfl-redis → $REDIS_IP"
  echo "  qfl-minio → $MINIO_IP"

  ssh -M -S "$SOCKET" -fN \
    -o "ExitOnForwardFailure=yes" \
    -o "ServerAliveInterval=10" \
    -o "ServerAliveCountMax=3" \
    -L "5435:${PG_IP}:5432" \
    -L "6379:${REDIS_IP}:6379" \
    -L "9000:${MINIO_IP}:9000" \
    -L "9001:${MINIO_IP}:9001" \
    "$HOST"

  echo "✓ Tunnels open — postgres:5435 | redis:6379 | minio:9000 | minio-ui:9001"
}

# ── Main loop: auto-reconnect on prod deploy / container restart ─────────────
echo "Starting SSH tunnels to $HOST (auto-reconnects on prod deploy)..."
echo "Press Ctrl+C to stop."
echo ""

while true; do
  if connect; then
    # Wait while tunnel is alive
    while ssh -S "$SOCKET" -O check "$HOST" 2>/dev/null; do
      sleep 5
    done
    echo "⚠ Tunnel dropped — reconnecting in ${RECONNECT_DELAY}s..."
  else
    echo "⚠ Connection failed — retrying in ${RECONNECT_DELAY}s..."
  fi
  sleep "$RECONNECT_DELAY"
done
