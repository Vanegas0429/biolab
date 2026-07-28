import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getPasswordResetTemplate } from '../templates/passwordResetTemplate.js';

function runUnitTests() {
  console.log("==========================================");
  console.log("PRUEBAS UNITARIAS DE SEGURIDAD Y CRIPTOFRAFÍA");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  };

  // 1. Generación de Token de Alta Entropía
  const rawToken1 = crypto.randomBytes(32).toString("hex");
  const rawToken2 = crypto.randomBytes(32).toString("hex");

  assert(rawToken1.length === 64, "1. rawToken generado tiene 64 caracteres hexadecimales (256 bits de entropía)");
  assert(rawToken1 !== rawToken2, "2. Dos llamadas sucesivas a randomBytes producen tokens distintos e impredecibles");

  // 2. Hash Criptográfico SHA-256
  const hash1 = crypto.createHash("sha256").update(rawToken1).digest("hex");
  const hash2 = crypto.createHash("sha256").update(rawToken1).digest("hex");
  const hash3 = crypto.createHash("sha256").update(rawToken2).digest("hex");

  assert(hash1.length === 64, "3. El hash SHA-256 generado es de 64 caracteres hex");
  assert(hash1 === hash2, "4. El mismo rawToken genera exactamente el mismo hash SHA-256");
  assert(hash1 !== rawToken1, "5. El hash almacenado NUNCA coincide con el token original en texto plano");
  assert(hash1 !== hash3, "6. Tokens diferentes producen hashes SHA-256 completamente distintos");

  // 3. Verificación de Contraseña con Bcrypt
  const password = "NuevaContraseñaSuperSegura2026!";
  const bcryptHash = bcrypt.hashSync(password, 10);
  const isValidBcrypt = bcrypt.compareSync(password, bcryptHash);
  const isInvalidBcrypt = bcrypt.compareSync("ContraseñaIncorrecta!", bcryptHash);

  assert(bcryptHash.startsWith("$2b$") || bcryptHash.startsWith("$2a$"), "7. Bcrypt genera un hash estándar válido");
  assert(isValidBcrypt === true, "8. bcrypt.compare valida correctamente la contraseña correcta");
  assert(isInvalidBcrypt === false, "9. bcrypt.compare rechaza contraseñas incorrectas");

  // 4. Generación de Plantilla HTML de Correo
  const testUrl = "http://77.42.120.211/RestablecerPassword/" + rawToken1;
  const template = getPasswordResetTemplate({ nombre: "Juan Pérez", resetUrl: testUrl, expiresInMinutes: 15 });

  assert(template.html.includes(testUrl), "10. La plantilla contiene la URL pública completa del frontend");
  assert(!template.html.includes("localhost"), "11. La plantilla NUNCA incluye referencias a localhost");
  assert(!template.html.includes("127.0.0.1"), "12. La plantilla NUNCA incluye 127.0.0.1");
  assert(!template.html.includes(hash1), "13. La plantilla NUNCA expone el HASH del token");
  assert(template.html.includes("15 minutos"), "14. La plantilla advierte la expiración de 15 minutos");

  console.log("\n==========================================");
  console.log(`RESULTADO DE PRUEBAS UNITARIAS: ${passed} Pasadas, ${failed} Fallidas`);
  console.log("==========================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runUnitTests();
