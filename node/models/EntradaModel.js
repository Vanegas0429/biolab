import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EntradaModel = db.define('entrada', {
    Id_Entrada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id_reactivo: { type: DataTypes.INTEGER},
    Lote: { type: DataTypes.STRING},
    Can_Inicial: { type: DataTypes.INTEGER},
    Can_Salida: { type: DataTypes.INTEGER},
    Uni_Medida: { type: DataTypes.ENUM('gr','L','mL')},
    Fec_Vencimiento: { type: DataTypes.DATE},
    Estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {
    freezeTableName: true
})

export default EntradaModel;
