import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EquipoModel = db.define("equipo", {
    id_equipo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    grupo: { type: DataTypes.STRING },
    linea: { type: DataTypes.STRING },
    centro_costos: { type: DataTypes.STRING },
    subcentro_costos: { type: DataTypes.STRING },
    observaciones: { type: DataTypes.STRING },
    img_equipo: { type: DataTypes.TEXT },
    // ficha_tecnica: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    // evitar pluralización en la gestión de la tabla
    freezeTableName: true
});

export default EquipoModel;