
import('./database/db.js').then(async ({default: db}) => {
  try {
    await db.authenticate();
    const [results] = await db.query('SHOW TABLES LIKE \'movimientomaterial\'');
    console.log('MovimientoMaterial table exists:', results.length > 0);
    const [cols] = await db.query('SHOW COLUMNS FROM produccion LIKE \'Can_Produccion\'');
    console.log('Can_Produccion exists:', cols.length > 0);
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
})

