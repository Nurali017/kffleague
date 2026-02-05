#!/usr/bin/env bash
#
# QFL Server Setup Script
# Integrates with existing kaisar-nginx on the server
# Run: sudo bash setup-server.sh
#
set -euo pipefail

DOMAIN="kff.1sportkz.com"
PROJECT_DIR="/home/deploy/qfl"
KAISAR_DIR="/opt/kaisar"
CERTBOT_EMAIL="admin@1sportkz.com"

echo "========================================="
echo "  QFL Server Setup"
echo "========================================="

# ---------- 1. Create project directory ----------
echo "[1/3] Setting up project directory..."
mkdir -p "$PROJECT_DIR"
chown deploy:deploy "$PROJECT_DIR"

# ---------- 2. SSL Certificate via existing kaisar certbot ----------
echo "[2/3] Obtaining SSL certificate for $DOMAIN..."

# Use kaisar's certbot volumes to get certificate
docker run --rm \
    -v "${KAISAR_DIR}/certbot/conf:/etc/letsencrypt" \
    -v "${KAISAR_DIR}/certbot/www:/var/www/certbot" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$CERTBOT_EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

echo "SSL certificate obtained for $DOMAIN"

# ---------- 3. Add nginx config to kaisar ----------
echo "[3/3] Adding QFL nginx config to kaisar..."

cp "$PROJECT_DIR/nginx/conf.d/default.conf" "$KAISAR_DIR/nginx/conf.d/kff.conf"

# Test and reload nginx
docker exec kaisar-nginx nginx -t && docker exec kaisar-nginx nginx -s reload
echo "Nginx reloaded with kff.1sportkz.com config"

echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. cp .env.production.example .env && nano .env"
echo "  3. bash deploy/deploy.sh --initial"
