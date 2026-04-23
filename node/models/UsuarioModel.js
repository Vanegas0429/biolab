import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define("usuarios", {

  documento: { type: DataTypes.INTEGER },
  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING },
  contraseña: { type: DataTypes.STRING },
  rol: { type: DataTypes.ENUM('administrador','solicitante','pasante','gestor','instructor','gerente','instructor_gerente')},
  estado: { type:DataTypes.ENUM('Activo','Inactivo')},
  uuid: { 
    type: DataTypes.STRING,
    primaryKey: true
  },

  token: { type: DataTypes.STRING }

}, {
  freezeTableName: true
});

export default UsuarioModel;
