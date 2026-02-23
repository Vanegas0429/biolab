
import { DataTypes } from "sequelize";
import db from "../database/db.js";

const UserModel = db.define("usuarios", {

  // ID principal
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Identificador único
  uuid: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  // Documento único del usuario
  documento: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  // Nombre completo
  nombre_completo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  // Correo único
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  // Contraseña encriptada
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // Rol del usuario
  rol: {
    type: DataTypes.ENUM("pasante", "instructor", "gestor"),
    allowNull: false
  },

  // Token para recuperación de contraseña
  token_recuperacion: {
    type: DataTypes.STRING(255),
    allowNull: true
  }

}, {
  freezeTableName: true, 
  timestamps: true       
});

export default UserModel;

import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define("usuarios", {

  documento: { type: DataTypes.INTEGER },
  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING },
  contraseña: { type: DataTypes.STRING },

  uuid: { 
    type: DataTypes.STRING,
    primaryKey: true
  },

  token: { type: DataTypes.STRING }

}, {
  freezeTableName: true
});

export default UsuarioModel;

