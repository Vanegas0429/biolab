import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ReactivosModel = db.define('Reactivos', {
    Id_Reactivo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_Reactivo: { type: DataTypes.STRING },
    Nomenclatura: { type: DataTypes.STRING},
    Uni_Medida: { type: DataTypes.STRING },
    Cantidad: { type: DataTypes.NUMBER},
    Pres_Reactivo: { type: DataTypes.STRING},
    Concentración: { type: DataTypes.STRING},
    Marca: { type: DataTypes.STRING},
    Fec_Vencimiento: { type: DataTypes.DATE},
    Fun_Química: { type: DataTypes.STRING},
    Est_Fisico: { type: DataTypes.DATE},
    Nat_Quimica: { type: DataTypes.STRING},
    Clasificación: { type: DataTypes.STRING},
    Peligrosidad: { type: DataTypes.NUMBER},
    Cla_Peligro: { type: DataTypes.STRING},
    Fic_Dat_Seguridad: { type: DataTypes.STRING}


}, {
    freezeTableName: true
})

export default ReactivosModel;
