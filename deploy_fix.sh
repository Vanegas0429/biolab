#!/bin/bash
# ==============================================
# BIOLAB DEPLOYMENT & PASSWORD RECOVERY FIX SCRIPT
# ==============================================

set -e

echo "=== 1. Verificando y asegurando usuario MySQL ==="
mysql -u root -e "CREATE USER IF NOT EXISTS 'biolab_user'@'localhost' IDENTIFIED BY 'BIOLAB2026*vps';"
mysql -u root -e "GRANT ALL PRIVILEGES ON biolab.* TO 'biolab_user'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
echo "Usuario MySQL biolab_user asegurado."

echo "=== 2. Verificando conexión a la Base de Datos ==="
mysql -u biolab_user -p'BIOLAB2026*vps' -e "USE biolab; SHOW TABLES;" || { echo "ERROR: Conexión MySQL fallida"; exit 1; }
echo "Conexión MySQL OK."

echo "=== 3. Aplicando migración de password_reset_tokens ==="
if [ -f /var/www/biolab/node/database/migrations/20260728_create_password_reset_tokens.sql ]; then
    mysql -u biolab_user -p'BIOLAB2026*vps' biolab < /var/www/biolab/node/database/migrations/20260728_create_password_reset_tokens.sql
    echo "Migración SQL aplicada exitosamente."
fi

echo "=== 4. Actualizando archivo .env del backend ==="
cat > /var/www/biolab/node/.env << 'ENVEOF'
NODE_ENV=production
PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biolab
DB_USER=biolab_user
DB_PASSWORD=BIOLAB2026*vps
JWT_SECRET=SuperSecretKey123!
FRONTEND_URL=http://77.42.120.211
PASSWORD_RESET_TTL_MINUTES=15

# Ajuste credenciales SMTP reales en este bloque o en las variables de entorno del servidor
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=biolab.sena@gmail.com
SMTP_PASS=app_password_aquí
SMTP_FROM_NAME=BIOLAB - Laboratorio
SMTP_FROM_EMAIL=biolab.sena@gmail.com
ENVEOF
echo "Backend .env actualizado."

echo "=== 5. Instalando dependencias del Backend ==="
cd /var/www/biolab/node
npm ci --production || npm install --production

echo "=== 6. Compilando Frontend React/Vite ==="
cd /var/www/biolab/Proyecto-Biolab-Frontend
npm ci || npm install
npm run build

echo "=== 7. Verificando certificado SSL para Nginx ==="
mkdir -p /etc/ssl/private /etc/ssl/certs
if [ ! -f /etc/ssl/certs/nginx-selfsigned.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/nginx-selfsigned.key \
        -out /etc/ssl/certs/nginx-selfsigned.crt \
        -subj '/CN=77.42.120.211'
fi

echo "=== 8. Escribiendo configuración Nginx ==="
cat > /etc/nginx/sites-available/biolab << 'NGINXEOF'
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    server_name 77.42.120.211 _;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    root /var/www/biolab/Proyecto-Biolab-Frontend/dist;
    index index.html;

    client_max_body_size 50M;

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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINXEOF

echo "=== 9. Habilitando sitio Nginx y testeando ==="
rm -f /etc/nginx/sites-enabled/biolab
ln -s /etc/nginx/sites-available/biolab /etc/nginx/sites-enabled/biolab
rm -f /etc/nginx/sites-enabled/default
nginx -t || { echo "ERROR: Configuración Nginx inválida"; exit 1; }
systemctl reload nginx
echo "Nginx recargado exitosamente."

echo "=== 10. Reiniciando Backend en PM2 con --update-env ==="
cd /var/www/biolab/node
pm2 restart biolab-backend --update-env || pm2 start app.js --name biolab-backend --update-env
pm2 save

echo ""
echo "=============================================="
echo "DESPLIEGUE BIOLAB COMPLETADO CON ÉXITO"
echo "URL Pública: http://77.42.120.211"
echo "=============================================="
