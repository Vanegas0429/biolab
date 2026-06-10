// Importamos el modelo de Usuario para interactuar con la base de datos
import UsuarioModel from "../models/UsuarioModel.js";

// Librería para encriptar contraseñas
import bcrypt from "bcrypt";

// Librería para generar tokens JWT
import jwt from "jsonwebtoken";

// Librería para generar identificadores únicos (UUID)
import { v4 as uuidv4 } from "uuid";

// Servicio de correos
import EmailService from "./EmailService.js";

class UsuarioService {

  // =========================
  // REGISTRAR USUARIO
  // =========================
  async register(data) {

    // Extraemos los datos enviados desde el frontend
    const { documento, nombre, correo, contraseña, rol, estado, telefono} = data;

    // Verificamos si ya existe un usuario con el mismo correo
    const UsuarioExist = await UsuarioModel.findOne({
      where: { correo: correo }
    });

    // Si ya existe, lanzamos un error
    if (UsuarioExist) throw new Error("El usuario ya existe");

    // Encriptamos la contraseña antes de guardarla en la base de datos
    const hashedcontraseña = await bcrypt.hash(contraseña, 10);

    // Generamos un UUID único para identificar al usuario
    const UsuarioUuid = uuidv4();

    // Creamos el usuario en la base de datos
    const Usuario = await UsuarioModel.create({
      documento,
      nombre,
      correo,
      contraseña: hashedcontraseña, // Guardamos la contraseña encriptada
      uuid: UsuarioUuid,
      rol, 
      estado,
      telefono
    });

    // Retornamos el usuario creado
    return Usuario;
  }

  // =========================
  // LOGIN
  // =========================
  async login(data) {

    // Extraemos correo y contraseña enviados por el frontend
    const { correo, contraseña } = data;

    // Validamos que ambos campos estén presentes
    if (!correo || !contraseña) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    // Buscamos el usuario por su correo
    const usuario = await UsuarioModel.findOne({
      where: { correo }
    });

    // Si no existe el usuario, enviamos error genérico
    if (!usuario) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    // Comparamos la contraseña ingresada con la almacenada (encriptada)
    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    // Si la contraseña no coincide, enviamos error
    if (!contraseñaValida) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    // Generamos un token JWT con el id y uuid del usuario
    const token = jwt.sign(
      { id: usuario.id, uuid: usuario.uuid, rol: usuario.rol }, // payload
      process.env.JWT_SECRET, // clave secreta
      { expiresIn: "2h" } // tiempo de expiración
    );

    // Eliminamos la contraseña del objeto antes de enviarlo al frontend
    const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();

    usuarioSinPassword.token = token

    // Retornamos el token y los datos del usuario sin contraseña
    return {
      // token,
      usuario: usuarioSinPassword
    };
  }

  // =========================
  // RECUPERACIÓN DE CONTRASEÑA
  // =========================
  
  async forgotPassword(correo) {
    if (!correo) throw new Error("El correo es obligatorio");

    const usuario = await UsuarioModel.findOne({ where: { correo } });
    if (!usuario) {
      // No revelar si el correo existe o no por seguridad, pero sí arrojar un error interno o simulado
      throw new Error("Si el correo existe, recibirá instrucciones");
    }

    // Generar token único (UUID sin guiones)
    const resetToken = uuidv4().replace(/-/g, '');

    // Guardar token en el usuario
    usuario.token = resetToken;
    await usuario.save();

    // Enviar correo
    const emailEnviado = await EmailService.enviarCorreoRecuperacion(
      usuario.correo,
      usuario.nombre,
      resetToken
    );

    if (!emailEnviado) {
      throw new Error("Hubo un problema al enviar el correo de recuperación");
    }

    return true;
  }

  async resetPassword(token, nuevaContraseña) {
    if (!token || !nuevaContraseña) {
      throw new Error("Token y nueva contraseña son obligatorios");
    }

    const usuario = await UsuarioModel.findOne({ where: { token } });
    
    if (!usuario) {
      throw new Error("El enlace de recuperación es inválido o ha expirado");
    }

    // Encriptar nueva contraseña
    const hashedContraseña = await bcrypt.hash(nuevaContraseña, 10);

    // Actualizar contraseña y limpiar token
    usuario.contraseña = hashedContraseña;
    usuario.token = null;
    await usuario.save();

    return true;
  }

  // =========================
  // GESTIÓN DE USUARIOS (ADMIN)
  // =========================
  
  // Obtener todos los usuarios registrados
  async getAll() {
    return await UsuarioModel.findAll({
      attributes: { exclude: ['contraseña'] } // Nunca enviar la contraseña por seguridad
    });
  }

  // Actualizar el rol de un usuario específico
  async updateRol(id, rol) {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    usuario.rol = rol;
    await usuario.save();

    // Devolver el usuario actualizado sin contraseña
    const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();
    return usuarioSinPassword;
  }
}

// Exportamos una instancia del servicio
export default new UsuarioService();