import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EquipoModel = db.define("equipo", {
    Id_Equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING },
    grupo: { type: DataTypes.STRING },
    linea: { type: DataTypes.TEXT },
    centro_costos: { type: DataTypes.STRING },
    placa: { type: DataTypes.STRING },
    serial: { type: DataTypes.STRING },
    vida_util: { type: DataTypes.INTEGER, allowNull: true },
    valor_unitario: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    fecha_adquisicion: { type: DataTypes.DATEONLY, allowNull: true },
    ficha_tecnica: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.ENUM("Activo", "Inactivo"), defaultValue: "Activo" }
}, {
    // evitar pluralización en la gestión de la tabla
    freezeTableName: true
});

export default EquipoModel;
