# Documentación Oficial: Sistema de Recuperación de Contraseña y Servicio Modular de Correo (BIOLAB)

## 1. Descripción del Flujo Seguro

1. **Solicitud de Recuperación (`POST /api/auth/forgot-password`)**:
   - El usuario ingresa su correo en la vista `/Forgot` o `/forgot-password`.
   - El backend valida y normaliza el correo (trim y minúsculas).
   - El backend **siempre responde con un mensaje genérico** (`200 OK`), previniendo ataques de enumeración de usuarios.
   - Si el usuario existe:
     - Invalida tokens anteriores activos.
     - Genera un token aleatorio de alta entropía de 32 bytes criptográficos (`crypto.randomBytes(32)` -> 64 caracteres hex).
     - Calcula el hash **SHA-256** del token (`crypto.createHash('sha256').update(rawToken).digest('hex')`).
     - Almacena **únicamente el hash SHA-256** en la tabla `password_reset_tokens` con una vigencia de 15 minutos (`expires_at`).
     - Envía un correo al usuario con la URL pública `${FRONTEND_URL}/RestablecerPassword/${rawToken}` conteniendo el token original (el token en texto plano **nunca** se guarda en la BD ni se imprime en logs).

2. **Restablecimiento de Contraseña (`POST /api/auth/reset-password`)**:
   - El usuario abre el enlace recibido en su navegador.
   - El frontend obtiene el token desde la URL.
   - El usuario escribe y confirma su nueva contraseña (mínimo 8 caracteres).
   - El backend calcula el hash SHA-256 del token recibido y consulta la base de datos.
   - Mediante una **transacción SQL atómica** (`db.transaction`):
     - Verifica que el registro coincida con `token_hash`, `used_at IS NULL` y `expires_at > NOW()`.
     - Cifra la nueva contraseña utilizando `bcrypt` (`saltRounds = 10`).
     - Actualiza el campo `contraseña` del usuario.
     - Marca el token como consumido (`used_at = NOW()`).
     - Invalida cualquier otro token pendiente del usuario.
   - El usuario recibe confirmación y es redirigido al inicio de sesión.

---

## 2. Archivos Creados
- `node/models/PasswordResetTokenModel.js`: Modelo Sequelize para la tabla `password_reset_tokens`.
- `node/config/emailTransport.js`: Configuración modular del transportador Nodemailer con verificación de inicio (`verifyTransporterConnection`).
- `node/templates/passwordResetTemplate.js`: Plantilla HTML/texto plano profesional, responsive y sin localhost.
- `node/database/migrations/20260728_create_password_reset_tokens.sql`: Migración SQL oficial para MySQL.
- `node/.env.example`: Plantilla de variables de entorno del backend sin secretos reales.
- `node/tests/unitPasswordReset.test.js`: Suite de pruebas unitarias criptográficas offline.
- `node/tests/passwordReset.test.js`: Suite de pruebas de integración backend.
- `docs/RECUPERACION_CONTRASENA.md`: Documentación técnica del sistema.

---

## 3. Archivos Modificados
- `node/services/UsuarioService.js`: Reconstrucción completa de `forgotPassword` y `resetPassword` con crypto, SHA-256 y transacciones SQL.
- `node/controllers/UsuarioController.js`: Enmascarado de logs y respuestas genéricas de seguridad.
- `node/routes/UsuarioRoutes.js`: Incorporación de middlewares de Rate Limiting (`express-rate-limit`).
- `node/services/EmailService.js`: Reestructuración modular, reexportación de métodos de reserva/registro.
- `node/app.js`: Configuración de `trust proxy`, asociaciones Sequelize y verificación SMTP.
- `Proyecto-Biolab-Frontend/src/home/UsuarioForgot.jsx`: Formulario con estado de carga, deshabilitación de botones y modal neutro.
- `Proyecto-Biolab-Frontend/src/home/ResetPassword.jsx`: Formulario con SweetAlert2, comprobación de token y validaciones.
- `Proyecto-Biolab-Frontend/src/App.jsx`: Registro de alias de rutas `/forgot-password` y `/reset-password/:token`.
- `deploy_fix.sh`: Script de despliegue actualizado para aplicar la migración SQL, compilar React y reiniciar PM2 con `--update-env`.

---

## 4. Dependencias Agregadas
- `express-rate-limit` (en `node/package.json`).

---

## 5. Variables de Entorno Requeridas (`.env`)

```ini
NODE_ENV=production
PORT=8000
JWT_SECRET=tu_clave_secreta_jwt_super_segura

DB_HOST=localhost
DB_PORT=3306
DB_NAME=biolab
DB_USER=biolab_user
DB_PASSWORD=tu_contraseña_mysql

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=biolab.sena@gmail.com
SMTP_PASS=contraseña_de_aplicacion_gmail
SMTP_FROM_NAME=BIOLAB - Laboratorio
SMTP_FROM_EMAIL=biolab.sena@gmail.com

FRONTEND_URL=http://77.42.120.211
PASSWORD_RESET_TTL_MINUTES=15
```

---

## 6. Configuración de Gmail con Contraseña de Aplicación

1. Iniciar sesión en la cuenta de Gmail del sistema BIOLAB.
2. Activar **Verificación en dos pasos** en la configuración de Seguridad de Google.
3. Ir a **Contraseñas de aplicaciones**.
4. Generar una nueva contraseña de aplicación asignando el nombre `BIOLAB Backend`.
5. Copiar los 16 caracteres generados y configurarlos en la variable `SMTP_PASS` en el archivo `.env` del VPS.

---

## 7. Script de Migración MySQL (`password_reset_tokens`)

```sql
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(255) NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `requested_ip` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_password_reset_tokens_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `usuarios` (`uuid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE INDEX `idx_token_hash` (`token_hash`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 8. Configuración de Nginx y PM2 en Producción

### Nginx (`/etc/nginx/sites-available/biolab`):
```nginx
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    server_name 77.42.120.211 _;

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
    }
}
```

### Comandos de Despliegue en VPS:
```bash
cd /var/www/biolab
bash deploy_fix.sh
```

---

## 9. Pruebas Ejecutadas y Resultados

| Prueba | Descripción | Resultado |
|---|---|---|
| 1. Entropía Criptográfica | Verificación de tokens de 32 bytes (64 hex chars) | ✅ EXITOSA |
| 2. Unicidad e Impredecibilidad | Generación aleatoria segura con `crypto.randomBytes` | ✅ EXITOSA |
| 3. Hashing SHA-256 | El token en texto plano nunca se guarda en la BD | ✅ EXITOSA |
| 4. Hash Bcrypt de Claves | Verificación y hash seguro de contraseñas | ✅ EXITOSA |
| 5. Plantilla de Correo | URL pública correcta (`FRONTEND_URL`) sin localhost ni IP local | ✅ EXITOSA |
| 6. Compilación Frontend | `npm run build` en Vite (0 errores) | ✅ EXITOSA |
| 7. Rate Limiting | Limitación de 5 solicitudes / 15 min por IP | ✅ EXITOSA |
