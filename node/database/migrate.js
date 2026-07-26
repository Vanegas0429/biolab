import db from "./db.js";

async function runMigration() {
  try {
    console.log("Conectando a la base de datos para aplicar migraciones...");
    await db.authenticate();
    console.log("Conexión a MySQL establecida.");

    // 1. Cambiar no_chapeta a placa en equipo
    const [equiposCols] = await db.query("SHOW COLUMNS FROM equipo LIKE 'no_chapeta'");
    if (equiposCols.length > 0) {
      console.log("Renombrando no_chapeta a placa en tabla equipo...");
      await db.query("ALTER TABLE equipo CHANGE COLUMN no_chapeta placa VARCHAR(255) DEFAULT NULL");
      console.log("✓ Columna no_chapeta renombrada a placa.");
    } else {
      console.log("- Columna placa ya existe en equipo.");
    }

    // 2. Quitar documento de usuarios
    const [usuariosCols] = await db.query("SHOW COLUMNS FROM usuarios LIKE 'documento'");
    if (usuariosCols.length > 0) {
      console.log("Eliminando columna documento de tabla usuarios...");
      await db.query("ALTER TABLE usuarios DROP COLUMN documento");
      console.log("✓ Columna documento eliminada.");
    } else {
      console.log("- Columna documento ya fue eliminada de usuarios.");
    }

    // 3. Agregar clasificacion a material
    const [matCols] = await db.query("SHOW COLUMNS FROM material LIKE 'clasificacion'");
    if (matCols.length === 0) {
      console.log("Agregando columna clasificacion en tabla material...");
      await db.query("ALTER TABLE material ADD COLUMN clasificacion ENUM('Desechable', 'Reutilizable') DEFAULT 'Desechable'");
      console.log("✓ Columna clasificacion agregada a material.");
    } else {
      console.log("- Columna clasificacion ya existe en material.");
    }

    // 4. Crear tabla entrada_materiales
    console.log("Verificando / creando tabla entrada_materiales...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS entrada_materiales (
        Id_Entrada_Material INT AUTO_INCREMENT PRIMARY KEY,
        Id_Material INT NOT NULL,
        Can_Inicial INT NOT NULL DEFAULT 0,
        Can_Existente INT NOT NULL DEFAULT 0,
        Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (Id_Material) REFERENCES material(Id_Material) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("✓ Tabla entrada_materiales lista.");

    // 5. Agregar Tipo_Institucion y Nom_Institucion a reserva
    const [resTipoCols] = await db.query("SHOW COLUMNS FROM reserva LIKE 'Tipo_Institucion'");
    if (resTipoCols.length === 0) {
      console.log("Agregando Tipo_Institucion y Nom_Institucion a tabla reserva...");
      await db.query("ALTER TABLE reserva ADD COLUMN Tipo_Institucion VARCHAR(100) DEFAULT NULL");
      await db.query("ALTER TABLE reserva ADD COLUMN Nom_Institucion VARCHAR(255) DEFAULT NULL");
      console.log("✓ Columnas Tipo_Institucion y Nom_Institucion agregadas a reserva.");
    } else {
      console.log("- Columnas de institución ya existen en reserva.");
    }

    console.log("¡Migración completada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando migración:", error);
    process.exit(1);
  }
}

runMigration();
