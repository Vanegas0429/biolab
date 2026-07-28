import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UsuarioService from '../services/UsuarioService.js';
import UsuarioModel from '../models/UsuarioModel.js';
import PasswordResetTokenModel from '../models/PasswordResetTokenModel.js';
import db from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

async function runTests() {
  console.log("==========================================");
  console.log("EJECUTANDO PRUEBAS DEL SISTEMA DE RECUPERACIÓN");
  console.log("==========================================\n");

  let testPassed = 0;
  let testFailed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      testPassed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      testFailed++;
    }
  };

  try {
    await db.authenticate();
    console.log("Conexión a BD establecida para pruebas.\n");

    // Limpieza previa de pruebas
    const testEmail = "test_reset_user@biolab.com";
    await UsuarioModel.destroy({ where: { correo: testEmail } });

    // 1. Crear usuario de prueba
    const plainPasswordOld = "PasswordVieja123!";
    const hashedOld = await bcrypt.hash(plainPasswordOld, 10);
    const userUuid = uuidv4();

    const user = await UsuarioModel.create({
      uuid: userUuid,
      nombre: "Usuario Pruebas",
      correo: testEmail,
      contraseña: hashedOld,
      rol: "solicitante",
      estado: "Activo",
      telefono: "3001234567"
    });

    assert(user && user.uuid === userUuid, "1. Crear usuario de prueba en BD");

    // 2. Solicitud con correo registrado
    await UsuarioService.forgotPassword(testEmail, "127.0.0.1", "NodeTestRunner");
    const tokenRecord = await PasswordResetTokenModel.findOne({
      where: { user_id: userUuid, used_at: null }
    });

    assert(tokenRecord !== null, "2. Se genera registro en password_reset_tokens para usuario existente");
    assert(tokenRecord.token_hash.length === 64, "3. El token_hash almacenado es una cadena SHA-256 de 64 caracteres hex");

    // 3. Solicitud con correo NO registrado (respuesta neutra sin crear token)
    const countBefore = await PasswordResetTokenModel.count();
    await UsuarioService.forgotPassword("no_existe@biolab.com", "127.0.0.1", "NodeTestRunner");
    const countAfter = await PasswordResetTokenModel.count();

    assert(countBefore === countAfter, "4. Correo inexistente no crea registros en password_reset_tokens ni genera errores");

    // 4. Invalidación de tokens previos al solicitar de nuevo
    await UsuarioService.forgotPassword(testEmail, "127.0.0.1", "NodeTestRunner");
    const activeTokens = await PasswordResetTokenModel.findAll({
      where: { user_id: userUuid, used_at: null }
    });

    assert(activeTokens.length === 1, "5. Una segunda solicitud invalida los tokens anteriores activos del usuario");

    // 5. Restablecer con token inválido
    try {
      await UsuarioService.resetPassword("token_falso_123456", "NuevaContraseña123!");
      assert(false, "6. Token falso debe ser rechazado");
    } catch (e) {
      assert(e.message.includes("no es válido"), "6. Token falso rechazado correctamente con mensaje genérico");
    }

    // 6. Restablecer con token válido
    // Para probar la función, generamos un rawToken válido y guardamos su hash directamente
    const rawTokenValid = crypto.randomBytes(32).toString("hex");
    const hashValid = crypto.createHash("sha256").update(rawTokenValid).digest("hex");
    const expiresFuture = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetTokenModel.create({
      user_id: userUuid,
      token_hash: hashValid,
      expires_at: expiresFuture,
      requested_ip: "127.0.0.1"
    });

    const plainPasswordNew = "NuevaPasswordSegura2026!";
    const resetSuccess = await UsuarioService.resetPassword(rawTokenValid, plainPasswordNew);

    assert(resetSuccess === true, "7. Restablecimiento exitoso con token válido");

    // 7. Verificar actualización de la contraseña en BD y consumo de token
    const updatedUser = await UsuarioModel.findByPk(userUuid);
    const passwordMatchNew = await bcrypt.compare(plainPasswordNew, updatedUser.contraseña);
    const passwordMatchOld = await bcrypt.compare(plainPasswordOld, updatedUser.contraseña);

    assert(passwordMatchNew === true, "8. La nueva contraseña permite validación con bcrypt");
    assert(passwordMatchOld === false, "9. La contraseña antigua ya NO funciona");

    const usedTokenRecord = await PasswordResetTokenModel.findOne({ where: { token_hash: hashValid } });
    assert(usedTokenRecord.used_at !== null, "10. El token queda marcado como consumido (used_at != null)");

    // 8. Intento de reutilizar el mismo token
    try {
      await UsuarioService.resetPassword(rawTokenValid, "OtraContraseña123!");
      assert(false, "11. Reutilización de token consumido debe ser rechazada");
    } catch (e) {
      assert(e.message.includes("no es válido"), "11. Token ya consumido rechazado correctamente");
    }

    // 9. Intento con token expirado
    const rawTokenExpired = crypto.randomBytes(32).toString("hex");
    const hashExpired = crypto.createHash("sha256").update(rawTokenExpired).digest("hex");
    const expiresPast = new Date(Date.now() - 5 * 60 * 1000); // Expiró hace 5 min

    await PasswordResetTokenModel.create({
      user_id: userUuid,
      token_hash: hashExpired,
      expires_at: expiresPast,
      requested_ip: "127.0.0.1"
    });

    try {
      await UsuarioService.resetPassword(rawTokenExpired, "NuevaContraseña123!");
      assert(false, "12. Token expirado debe ser rechazado");
    } catch (e) {
      assert(e.message.includes("no es válido"), "12. Token expirado rechazado correctamente");
    }

    // Limpieza final
    await PasswordResetTokenModel.destroy({ where: { user_id: userUuid } });
    await UsuarioModel.destroy({ where: { uuid: userUuid } });

  } catch (error) {
    console.error("Error imprevisto en las pruebas:", error);
    testFailed++;
  } finally {
    console.log("\n==========================================");
    console.log(`RESULTADO FINAL DE PRUEBAS:`);
    console.log(`Pruebas Exitosas: ${testPassed}`);
    console.log(`Pruebas Fallidas: ${testFailed}`);
    console.log("==========================================\n");
    process.exit(testFailed > 0 ? 1 : 0);
  }
}

runTests();
