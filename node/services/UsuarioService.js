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
