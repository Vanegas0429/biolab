import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ActividadModel = db.define('actividades', {
    Id_Actividad: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_Actividad: {type: DataTypes.STRING},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}


}, {
    freezeTableName: true
})

export default ActividadModel;
