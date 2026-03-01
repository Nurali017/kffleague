BACKEND_DIR  := backend
FRONTEND_DIR := qfl-website
ADMIN_DIR    := qfl-admin

.PHONY: tunnel backend frontend admin dev staging kill migrate logs logs-backend logs-worker logs-frontend help

help:
	@echo "Local dev against production DB/MinIO via SSH tunnels"
	@echo ""
	@echo "  make tunnel    — open SSH tunnels (Ctrl+C to close)"
	@echo "  make backend   — kill port 8000, start FastAPI --reload"
	@echo "  make frontend  — kill port 3000, clear .next cache, start Next.js"
	@echo "  make admin     — kill port 3001, clear .next cache, start Admin"
	@echo "  make dev       — all four in tmux (or background)"
	@echo "  make kill      — kill all dev processes"
	@echo ""
	@echo "Prod logs (via SSH):"
	@echo "  make logs          — all containers (follow)"
	@echo "  make logs-backend  — qfl-backend only"
	@echo "  make logs-worker   — celery worker only"
	@echo "  make logs-frontend — qfl-frontend only"

# ── Helpers ──────────────────────────────────────────────────────────────────
define kill_port
	@pid=$$(lsof -ti tcp:$(1) -sTCP:LISTEN 2>/dev/null || true); \
	if [ -n "$$pid" ]; then \
	  echo "→ Killing PID $$pid on port $(1)..."; \
	  kill $$pid 2>/dev/null || true; \
	  sleep 1; \
	fi
endef

# ── SSH tunnels ──────────────────────────────────────────────────────────────
tunnel:
	bash scripts/dev-tunnel.sh

# ── Backend ──────────────────────────────────────────────────────────────────
backend:
	$(call kill_port,8000)
	cd $(BACKEND_DIR) && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# ── Frontend ─────────────────────────────────────────────────────────────────
frontend:
	$(call kill_port,3000)
	@echo "→ Clearing Next.js cache..."
	rm -rf $(FRONTEND_DIR)/.next
	cd $(FRONTEND_DIR) && npm run dev

# ── Admin ────────────────────────────────────────────────────────────────────
admin:
	$(call kill_port,3001)
	@echo "→ Clearing Next.js cache..."
	rm -rf $(ADMIN_DIR)/.next
	cd $(ADMIN_DIR) && npm run dev

# ── Kill everything ──────────────────────────────────────────────────────────
kill:
	@echo "→ Closing SSH tunnel..."
	@ssh -S /tmp/qfl-dev-tunnel.sock -O exit debian@kmff.kz 2>/dev/null || true
	$(call kill_port,8000)
	$(call kill_port,3000)
	$(call kill_port,3001)
	$(call kill_port,5435)
	$(call kill_port,6379)
	$(call kill_port,9000)
	$(call kill_port,9001)
	@echo "→ All dev processes stopped."

# ── Production logs (via SSH) ────────────────────────────────────────────────
PROD_HOST := debian@kmff.kz
PROD_PATH := /home/debian/qfl

logs:
	ssh $(PROD_HOST) "docker logs -f --tail=100 qfl-backend & docker logs -f --tail=100 qfl-frontend & docker logs -f --tail=100 qfl-celery-worker & wait"

logs-backend:
	ssh $(PROD_HOST) "docker logs -f --tail=200 qfl-backend"

logs-worker:
	ssh $(PROD_HOST) "docker logs -f --tail=200 qfl-celery-worker"

logs-frontend:
	ssh $(PROD_HOST) "docker logs -f --tail=200 qfl-frontend"

# ── All together in one terminal ─────────────────────────────────────────────
dev:
	bash scripts/dev.sh

# ── Staging: prod DB dump + local postgres + prod MinIO ──────────────────────
staging:
	bash scripts/staging.sh

# ── Migrate: run alembic upgrade head on PROD DB via SSH tunnel ───────────────
# Requires tunnel to be open: make tunnel
migrate:
	@echo "→ Running alembic upgrade head on PROD DB (via tunnel :5435)..."
	@export $$(grep -v '^#' $(BACKEND_DIR)/.env | grep -E '^(DATABASE_URL|MINIO_)' | xargs) && \
	  cd $(BACKEND_DIR) && \
	  DATABASE_URL="$$(grep '^DATABASE_URL' .env | cut -d= -f2-)" \
	  python3 -m alembic upgrade heads
	@echo "✓ Migrations applied to prod DB."
