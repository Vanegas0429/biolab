-- Script de migración SQL para el sistema de recuperación de contraseña BIOLAB
-- Tabla: password_reset_tokens

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
