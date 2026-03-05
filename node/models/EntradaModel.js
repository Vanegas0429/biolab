import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EntradaModel = db.define('entrada', {
    Id_Entrada: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Id_reactivo: { type: DataTypes.NUMBER},
    Lote: { type: DataTypes.STRING},
    Can_Inicial: { type: DataTypes.NUMBER},
    Can_Salida: { type: DataTypes.NUMBER},
    Uni_Medida: { type: DataTypes.ENUM('gr','L','mL')},
    Fec_Vencimiento: { type: DataTypes.DATE},
    Estado: { type: DataTypes.ENUM("Activo", "Inactivo") }
}, {

    freezeTableName: true
})

export default EntradaModel;
