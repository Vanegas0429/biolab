import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ReactivosModel = db.define('reactivos', {
    Id_Reactivo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_reactivo: { type: DataTypes.STRING },
    Nomenclatura: { type: DataTypes.STRING},
    Presentacion: { type: DataTypes.STRING},
    Est_reactivo: { type: DataTypes.ENUM ("Bueno","Dañado")},
    Estado: { type: DataTypes.ENUM("Activo","Inactivo")},
    // Ficha_tecnica: { type: DataTypes.STRING }

}, {
    freezeTableName: true
})

export default ReactivosModel;
