#!/usr/bin/env bash
#
# QFL Server Setup Script
# Integrates with existing onesport-admin (nginx) on the server
# Run: bash setup-server.sh
#
set -euo pipefail

DOMAIN="kffleague.kz"
PROJECT_DIR="/home/debian/qfl"
ONESPORT_DIR="/home/debian/1sport"
CERTBOT_EMAIL="admin@kffleague.kz"

echo "========================================="
echo "  QFL Server Setup"
echo "========================================="

# ---------- 1. Create project directory ----------
echo "[1/5] Setting up project directory..."
mkdir -p "$PROJECT_DIR"

# ---------- 2. Create QFL nginx config directory ----------
echo "[2/5] Setting up nginx include directory..."
mkdir -p "$ONESPORT_DIR/qfl-nginx"
cp "$PROJECT_DIR/nginx/conf.d/default.conf" "$ONESPORT_DIR/qfl-nginx/kffleague.kz.conf"

# Add volume mount to 1sport docker-compose if not present
if ! grep -q "qfl-nginx" "$ONESPORT_DIR/docker-compose.yml"; then
    echo ""
    echo "  !! Manual step required !!"
    echo "  Add this volume to onesport-admin in $ONESPORT_DIR/docker-compose.yml:"
    echo "    - ./qfl-nginx:/etc/nginx/qfl:ro"
    echo ""
    echo "  And add this line to $ONESPORT_DIR/nginx.conf inside http{} block:"
    echo "    include /etc/nginx/qfl/*.conf;"
    echo ""
fi

# ---------- 3. SSL Certificate ----------
echo "[3/5] Obtaining SSL certificate for $DOMAIN..."

# Use the existing 1sport certbot with webroot
cd "$ONESPORT_DIR"
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$CERTBOT_EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

echo "SSL certificate obtained for $DOMAIN"

# ---------- 4. Reload nginx ----------
echo "[4/5] Reloading nginx..."
docker exec onesport-admin nginx -t && docker exec onesport-admin nginx -s reload
echo "Nginx reloaded with $DOMAIN config"

# ---------- 5. Verify ----------
echo "[5/5] Verifying..."
curl -sf "http://127.0.0.1:80" -H "Host: $DOMAIN" > /dev/null && echo "HTTP redirect OK" || echo "HTTP check skipped"

echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. cp .env.production.example .env && nano .env"
echo "  3. bash deploy/deploy.sh --initial"
