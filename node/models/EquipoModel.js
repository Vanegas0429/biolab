import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EquipoModel = db.define("equipo", {
    Id_Equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    grupo: { type: DataTypes.STRING },
    linea: { type: DataTypes.STRING },
    centro_costos: { type: DataTypes.STRING },
    placa: { type: DataTypes.STRING },
    serial: { type: DataTypes.STRING },
    vida_util: { type: DataTypes.INTEGER },
    valor_unitario: { type: DataTypes.DECIMAL(10, 2) },
    fecha_adquisicion: { type: DataTypes.DATEONLY },
    img_equipo: { type: DataTypes.TEXT },
    ficha_tecnica: { type: DataTypes.STRING },
    estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    // evitar pluralización en la gestión de la tabla
    freezeTableName: true
});

export default EquipoModel;