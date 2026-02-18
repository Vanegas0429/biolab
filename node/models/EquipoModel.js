import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EquipoModel = db.define("equipo", {
    id_equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    grupo: { type: DataTypes.STRING },
    linea: { type: DataTypes.STRING },
    centro_costos: { type: DataTypes.STRING },
    subcentro_costos: { type: DataTypes.STRING },
    observaciones: { type: DataTypes.STRING },
    id_funcionario: { type: DataTypes.INTEGER },
    img_equipo: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    // evitar pluralización en la gestión de la tabla
    freezeTableName: true
});

export default EquipoModel;