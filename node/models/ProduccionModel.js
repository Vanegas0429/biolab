import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProduccionModel = db.define('Produccion', {
    Id_produccion: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Lote: { type: DataTypes.STRING},
    Tip_produccion: {type: DataTypes.ENUM("Practica","Propia","Externa")},
    Fec_produccion: { type: DataTypes.DATE},
    Id_especie: { type: DataTypes.NUMBER},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}



}, {
    freezeTableName: true
})

export default ProduccionModel;
