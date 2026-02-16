import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EspeciesModel = db.define('especie', {
    Id_especie: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_especie: {type: DataTypes.STRING},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}


}, {
    freezeTableName: true
})

export default EspeciesModel;
