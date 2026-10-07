import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define("usuarios", {

  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING },
  contraseña: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  rol: { 
    type: DataTypes.ENUM('administrador', 'solicitante', 'pasante', 'gestor', 'instructor'),
    defaultValue: 'solicitante'
  },
  estado: { 
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo'
  },
  uuid: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  token: { type: DataTypes.STRING },
  tokenExpiry: { type: DataTypes.DATE }

}, {
  freezeTableName: true
});

export default UsuarioModel;
