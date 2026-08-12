import db from './database/db.js';

async function applyDB() {
    try {
        await db.authenticate();
        console.log("Conectado a la base de datos MySQL");

        const queries = [
            "ALTER TABLE `reservamaterial` ADD COLUMN `Mat_Utilizados` FLOAT DEFAULT 0;",
            "ALTER TABLE `reservamaterial` ADD COLUMN `Mat_Devueltos` FLOAT DEFAULT 0;",
            "ALTER TABLE `reservaequipo` ADD COLUMN `Observaciones` TEXT;",
            "ALTER TABLE `produccion` ADD COLUMN `Can_Produccion` INT DEFAULT 0;",
            `CREATE TABLE IF NOT EXISTS \`movimientomaterial\` (
                \`Id_Movimiento_Material\` INT AUTO_INCREMENT PRIMARY KEY,
                \`Id_Entrada_Material\` INT NOT NULL,
                \`Id_Reserva\` INT NULL,
                \`Tipo\` ENUM('Entrada', 'Salida', 'Devolución', 'Ajuste') NOT NULL,
                \`Cantidad\` FLOAT NOT NULL,
                \`Fecha\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                \`Detalle\` VARCHAR(255) NULL,
                \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
        ];

        for (const q of queries) {
            try {
                await db.query(q);
                console.log("Consulta ejecutada con éxito:", q.substring(0, 50));
            } catch (err) {
                console.log("Nota/Ignorado (posiblemente ya existía):", err.message);
            }
        }

        const [colsProd] = await db.query('SHOW COLUMNS FROM produccion');
        console.log('Columnas de produccion:', colsProd.map(c => c.Field));

        const [colsResMat] = await db.query('SHOW COLUMNS FROM reservamaterial');
        console.log('Columnas de reservamaterial:', colsResMat.map(c => c.Field));

        const [colsResEq] = await db.query('SHOW COLUMNS FROM reservaequipo');
        console.log('Columnas de reservaequipo:', colsResEq.map(c => c.Field));

        const [tables] = await db.query('SHOW TABLES');
        console.log('Tablas en BD:', tables.map(t => Object.values(t)[0]));

        process.exit(0);
    } catch (error) {
        console.error("Error al aplicar cambios a la base de datos:", error);
        process.exit(1);
    }
}

applyDB();
