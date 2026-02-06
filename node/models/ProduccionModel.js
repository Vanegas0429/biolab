import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProduccionModel = db.define('Produccion', {
    Id_produccion: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Tip_produccion: {type: DataTypes.ENUM("Practica","Propia","Externa")},
    Cod_produccion: { type: DataTypes.STRING}



}, {
    freezeTableName: true
})

export default ProduccionModel;
