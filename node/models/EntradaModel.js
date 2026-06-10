import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EntradaModel = db.define('entrada', {
    Id_Entrada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id_reactivo: { type: DataTypes.INTEGER, field: 'Id_Reactivo'},
    Lote: { type: DataTypes.STRING},
    Can_Inicial: { type: DataTypes.INTEGER},
    Can_Existente: { type: DataTypes.INTEGER, field: 'Can_Salida' },
    Uni_Medida: { type: DataTypes.ENUM('gr','L','mL')},
    Fec_Vencimiento: { type: DataTypes.DATE},
    Estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    freezeTableName: true,
    timestamps: true,
})

export default EntradaModel;
