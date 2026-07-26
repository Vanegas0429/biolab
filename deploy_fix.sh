#!/bin/bash
# ==============================================
# BIOLAB DEPLOYMENT FIX SCRIPT
# ==============================================

echo "=== 1. Creating MySQL user ==="
mysql -u root -e "CREATE USER IF NOT EXISTS 'biolab_user'@'localhost' IDENTIFIED BY 'BIOLAB2026*vps';"
mysql -u root -e "GRANT ALL PRIVILEGES ON biolab.* TO 'biolab_user'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"
echo "MySQL user biolab_user created."

echo "=== 2. Verifying MySQL connection ==="
mysql -u biolab_user -p'BIOLAB2026*vps' -e "USE biolab; SHOW TABLES;" || { echo "MySQL connection FAILED"; exit 1; }
echo "MySQL connection OK."

echo "=== 3. Updating backend .env ==="
cat > /var/www/biolab/node/.env << 'ENVEOF'
DB_HOST=localhost
DB_PORT=3306
DB_NAME=biolab
DB_USER=biolab_user
DB_PASSWORD=BIOLAB2026*vps
JWT_SECRET=SuperSecretKey123!
PORT=8000
ENVEOF
echo "Backend .env updated."

echo "=== 4. Updating backend db.js to use env vars ==="
cat > /var/www/biolab/node/database/db.js << 'DBEOF'
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME || 'biolab',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
);

export default db;
DBEOF
echo "Backend db.js updated."

echo "=== 4.5. Ensuring SSL Certificate ==="
mkdir -p /etc/ssl/private /etc/ssl/certs
if [ ! -f /etc/ssl/certs/nginx-selfsigned.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj '/CN=77.42.120.211'
fi

echo "=== 5. Writing correct Nginx configuration ==="
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
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINXEOF
echo "Nginx config written."

echo "=== 6. Enabling Nginx site ==="
rm -f /etc/nginx/sites-enabled/biolab
ln -s /etc/nginx/sites-available/biolab /etc/nginx/sites-enabled/biolab
rm -f /etc/nginx/sites-enabled/default
echo "Nginx site enabled."

echo "=== 7. Testing Nginx config ==="
nginx -t || { echo "Nginx config FAILED"; exit 1; }
echo "Nginx config OK."

echo "=== 8. Reloading Nginx ==="
systemctl reload nginx
echo "Nginx reloaded."

echo "=== 9. Restarting backend with PM2 ==="
cd /var/www/biolab/node
pm2 delete biolab-backend 2>/dev/null
pm2 start app.js --name biolab-backend
pm2 save
echo "Backend restarted."

echo "=== 10. Checking PM2 status ==="
pm2 list --no-color

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "Visit: http://77.42.120.211"
