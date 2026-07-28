-- Script de migración SQL para la tabla password_reset_tokens en MySQL BIOLAB

-- Asegurar que la columna uuid en usuarios tenga un índice si no lo tiene
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'usuarios' AND index_name = 'PRIMARY');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE `usuarios` ADD PRIMARY KEY (`uuid`);', 'SELECT "PRIMARY KEY ya existe";');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear tabla password_reset_tokens coincidiendo con el tipo y cotejo de usuarios.uuid
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token_hash` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
