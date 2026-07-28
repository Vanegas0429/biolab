// Importamos el modelo de Usuario y PasswordResetToken
import UsuarioModel from "../models/UsuarioModel.js";
import PasswordResetTokenModel from "../models/PasswordResetTokenModel.js";
import db from "../database/db.js";

// Librería para encriptar contraseñas
import bcrypt from "bcrypt";

// Librería para generar tokens JWT
import jwt from "jsonwebtoken";

// Librería para generar identificadores únicos (UUID) y aleatorios criptográficos
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { Op } from "sequelize";

// Servicio de correos
import EmailService from "./EmailService.js";

class UsuarioService {

  // =========================
  // REGISTRAR USUARIO
  // =========================
  async register(data) {
    const { nombre, correo, contraseña, rol, estado, telefono } = data;

    const correoNormalizado = (correo || "").trim().toLowerCase();

    const UsuarioExist = await UsuarioModel.findOne({
      where: { correo: correoNormalizado }
    });

    if (UsuarioExist) throw new Error("El usuario ya existe");

    const hashedcontraseña = await bcrypt.hash(contraseña, 10);
    const UsuarioUuid = uuidv4();

    const Usuario = await UsuarioModel.create({
      nombre,
      correo: correoNormalizado,
      contraseña: hashedcontraseña,
      uuid: UsuarioUuid,
      rol, 
      estado,
      telefono
    });

    // Enviar correo de registro en segundo plano
    EmailService.enviarCorreoRegistro(correoNormalizado, nombre).catch(err => {
      console.error("Error enviando correo de registro:", err.message);
    });

    return Usuario;
  }

  // =========================
  // LOGIN
  // =========================
  async login(data) {
    const { correo, contraseña } = data;

    if (!correo || !contraseña) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    const correoNormalizado = correo.trim().toLowerCase();

    const usuario = await UsuarioModel.findOne({
      where: { correo: correoNormalizado }
    });

    if (!usuario) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!contraseñaValida) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: usuario.id, uuid: usuario.uuid, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();
    usuarioSinPassword.token = token;

    return {
      usuario: usuarioSinPassword
    };
  }

  // =========================
  // RECUPERACIÓN DE CONTRASEÑA (DISEÑO SEGURO)
  // =========================
  
  /**
   * Procesa la solicitud de olvido de contraseña.
   * Genera un token aleatorio, guarda únicamente su HASH SHA-256 en BD y envía la versión original por email.
   * Siempre responde de forma neutra.
   */
  async forgotPassword(inputEmail, ipAddress = null, userAgent = null) {
    if (!inputEmail || typeof inputEmail !== 'string') {
      return true; // No revelar nada
    }

    const email = inputEmail.trim().toLowerCase();
    const usuario = await UsuarioModel.findOne({ where: { correo: email } });

    // Si el usuario no existe, finalizar silenciosamente sin dar pistas
    if (!usuario) {
      console.log(`[FORGOT] Solicitud procesada para correo no registrado (silencioso)`);
      return true;
    }

    const ttlMinutes = parseInt(process.env.PASSWORD_RESET_TTL_MINUTES || "15", 10);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // Invalidar tokens previos activos de este usuario
    await PasswordResetTokenModel.update(
      { used_at: new Date() },
      {
        where: {
          user_id: usuario.uuid,
          used_at: null,
          expires_at: { [Op.gt]: new Date() }
        }
      }
    );

    // Generar token seguro de 32 bytes (64 caracteres hexadecimales)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Guardar únicamente el HASH en la base de datos
    await PasswordResetTokenModel.create({
      user_id: usuario.uuid,
      token_hash: tokenHash,
      expires_at: expiresAt,
      requested_ip: ipAddress,
      user_agent: userAgent ? userAgent.substring(0, 255) : null
    });

    // Construir la URL pública del frontend usando la variable de entorno
    const frontendUrl = (process.env.FRONTEND_URL || 'http://77.42.120.211').replace(/\/+$/, '');
    const resetUrl = `${frontendUrl}/RestablecerPassword/${rawToken}`;

    // Enviar el correo electrónico
    await EmailService.sendPasswordResetEmail({
      to: usuario.correo,
      nombre: usuario.nombre,
      resetUrl,
      expiresInMinutes: ttlMinutes
    });

    return true;
  }

  /**
   * Restablece la contraseña utilizando el token recibido.
   * Valida la coincidencia del HASH SHA-256 en la BD, la vigencia y ejecuta la actualización atómicamente.
   */
  async resetPassword(rawToken, newPassword) {
    if (!rawToken || !newPassword) {
      throw new Error("El enlace de recuperación no es válido o ha expirado.");
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    // Calcular el hash del token recibido
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Transacción SQL atómica para prevenir condiciones de carrera
    const result = await db.transaction(async (t) => {
      // Buscar registro del token no usado y vigente
      const tokenRecord = await PasswordResetTokenModel.findOne({
        where: {
          token_hash: tokenHash,
          used_at: null,
          expires_at: { [Op.gt]: new Date() }
        },
        transaction: t
      });

      if (!tokenRecord) {
        throw new Error("El enlace de recuperación no es válido o ha expirado.");
      }

      // Buscar al usuario asociado
      const usuario = await UsuarioModel.findByPk(tokenRecord.user_id, { transaction: t });
      if (!usuario) {
        throw new Error("El enlace de recuperación no es válido o ha expirado.");
      }

      // Cifrar la nueva contraseña con bcrypt
      const hashedContraseña = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña del usuario
      usuario.contraseña = hashedContraseña;
      await usuario.save({ transaction: t });

      // Marcar el token actual como utilizado
      tokenRecord.used_at = new Date();
      await tokenRecord.save({ transaction: t });

      // Marcar cualquier otro token pendiente del mismo usuario como consumido
      await PasswordResetTokenModel.update(
        { used_at: new Date() },
        {
          where: {
            user_id: usuario.uuid,
            used_at: null
          },
          transaction: t
        }
      );

      return true;
    });

    return result;
  }

  // =========================
  // GESTIÓN DE USUARIOS (ADMIN)
  // =========================
  
  async getAll() {
    return await UsuarioModel.findAll({
      attributes: { exclude: ['contraseña'] }
    });
  }

  async updateRol(id, rol) {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    usuario.rol = rol;
    await usuario.save();

    const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();
    return usuarioSinPassword;
  }
}

export default new UsuarioService();