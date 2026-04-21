import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MaterialModel = db.define('material', {
    Id_Material: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_Material: {type: DataTypes.STRING},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}


}, {
    freezeTableName: true
})

export default MaterialModel;