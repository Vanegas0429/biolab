import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EquipoModel = db.define("equipo", {
    Id_Equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    grupo: { type: DataTypes.STRING },
    linea: { type: DataTypes.STRING },
    centro_costos: { type: DataTypes.STRING },
    no_chapeta: { type: DataTypes.STRING },
    img_equipo: { type: DataTypes.TEXT },
    ficha_tecnica: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    // evitar pluralización en la gestión de la tabla
    freezeTableName: true
});

export default EquipoModel;