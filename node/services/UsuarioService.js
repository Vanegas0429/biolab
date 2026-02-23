
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class UserService {

  // Método para registrar usuarios
  async register(data) {

    // Destructuración
    const { documento, nombre_completo, correo, contraseña, rol } = data;

    // Validar si ya existe un usuario con ese correo
    const userExist = await UserModel.findOne({
      where: { correo }
    });

    if (userExist) {
      throw new Error("El usuario ya existe");
    }

    // Validar documento también (buena práctica)
    const documentoExist = await UserModel.findOne({
      where: { documento }
    });

    if (documentoExist) {
      throw new Error("El documento ya está registrado");
    }

    // Generar hash seguro de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Generar uuid único
    const userUuid = uuidv4();

    // Guardar usuario en la base de datos
    const user = await UserModel.create({
      documento,
      nombre_completo,
      correo,
      contraseña: hashedPassword,
      uuid: userUuid,
      rol
    });

    return user;
  }

}

export default new UserService();

// Importamos el modelo de Usuario para interactuar con la base de datos
import UsuarioModel from "../models/UsuarioModel.js";

// Librería para encriptar contraseñas
import bcrypt from "bcrypt";

// Librería para generar tokens JWT
import jwt from "jsonwebtoken";

// Librería para generar identificadores únicos (UUID)
import { v4 as uuidv4 } from "uuid";

class UsuarioService {

  // =========================
  // REGISTRAR USUARIO
  // =========================
  async register(data) {

    // Extraemos los datos enviados desde el frontend
    const { documento, nombre, correo, contraseña } = data;

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
      uuid: UsuarioUuid
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
      { id: usuario.id, uuid: usuario.uuid }, // payload
      process.env.JWT_SECRET, // clave secreta
      { expiresIn: "2h" } // tiempo de expiración
    );

    // Eliminamos la contraseña del objeto antes de enviarlo al frontend
    const { contraseña: _, ...usuarioSinPassword } = usuario.toJSON();

    // Retornamos el token y los datos del usuario sin contraseña
    return {
      token,
      usuario: usuarioSinPassword
    };
  }
}

// Exportamos una instancia del servicio
export default new UsuarioService();
