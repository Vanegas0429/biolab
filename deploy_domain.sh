#!/bin/bash
# ==============================================
# BIOLAB DOMAIN DEPLOYMENT SCRIPT
# Dominio: biolabdigital.com
# Servidor: 77.42.120.211
# ==============================================
set -e

echo "==========================================="
echo "  BIOLAB — Configuración de Dominio + SSL"
echo "==========================================="

# 1. Verificar DNS
echo ""
echo "=== 1. Verificando propagación DNS ==="
DNS_CHECK=$(dig +short biolabdigital.com A 2>/dev/null || nslookup biolabdigital.com 2>/dev/null | grep -oP '\d+\.\d+\.\d+\.\d+' | tail -1 || echo "")
echo "DNS resuelve a: ${DNS_CHECK:-'No resuelto aún'}"

# 2. Instalar Certbot si no está instalado
echo ""
echo "=== 2. Instalando Certbot (si no está instalado) ==="
if ! command -v certbot &> /dev/null; then
    apt update
    apt install -y certbot python3-certbot-nginx
    echo "Certbot instalado."
else
    echo "Certbot ya está instalado."
fi

# 3. Configurar Nginx para el dominio
echo ""
echo "=== 3. Configurando Nginx para el dominio ==="
cat > /etc/nginx/sites-available/biolab << 'NGINXEOF'
server {
    listen 80;
    server_name biolabdigital.com www.biolabdigital.com;

    root /var/www/biolab/Proyecto-Biolab-Frontend/dist;
    index index.html;

    client_max_body_size 50M;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINXEOF

# Activar el sitio
rm -f /etc/nginx/sites-enabled/biolab
ln -s /etc/nginx/sites-available/biolab /etc/nginx/sites-enabled/biolab
rm -f /etc/nginx/sites-enabled/default 2>/dev/null

echo "Nginx configurado para biolabdigital.com"

# 4. Probar y recargar Nginx (sin SSL primero)
echo ""
echo "=== 4. Probando configuración Nginx ==="
nginx -t || { echo "❌ Error en config Nginx"; exit 1; }
systemctl reload nginx
echo "✅ Nginx recargado."

# 5. Generar certificado SSL con Certbot
echo ""
echo "=== 5. Generando certificado SSL con Let's Encrypt ==="
certbot --nginx -d biolabdigital.com -d www.biolabdigital.com \
    --non-interactive --agree-tos \
    -m vanegaskevinalexander@gmail.com \
    --redirect
echo "✅ Certificado SSL generado y configurado."

# 6. Actualizar .env del backend
echo ""
echo "=== 6. Actualizando .env del backend ==="
cat > /var/www/biolab/node/.env << 'ENVEOF'
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biolab
DB_USER=biolab_user
DB_PASSWORD=BIOLAB2026*vps
JWT_SECRET=SuperSecretKey123!
PORT=8000
FRONTEND_URL=https://biolabdigital.com
NODE_ENV=production

# SMTP Gmail (correos reales)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=vanegaskevinalexander@gmail.com
SMTP_PASS=xdak fmds uwql dwqf
ENVEOF
echo "✅ Backend .env actualizado con dominio y SMTP."

# 7. Reiniciar backend
echo ""
echo "=== 7. Reiniciando backend con PM2 ==="
cd /var/www/biolab/node
pm2 restart biolab-backend --update-env
pm2 save
echo "✅ Backend reiniciado."

# 8. Verificar Nginx final
echo ""
echo "=== 8. Verificación final de Nginx ==="
nginx -t
systemctl reload nginx
echo "✅ Nginx recargado."

# 9. Verificar PM2
echo ""
echo "=== 9. Estado de PM2 ==="
pm2 list --no-color

# 10. Test rápido
echo ""
echo "=== 10. Test de conectividad ==="
echo "HTTP redirect test:"
curl -sI http://biolabdigital.com 2>/dev/null | head -5 || echo "(curl no disponible)"
echo ""
echo "HTTPS test:"
curl -sI https://biolabdigital.com 2>/dev/null | head -5 || echo "(curl no disponible)"

echo ""
echo "==========================================="
echo "  ✅ DESPLIEGUE COMPLETADO"
echo "  URL: https://biolabdigital.com"
echo "==========================================="
