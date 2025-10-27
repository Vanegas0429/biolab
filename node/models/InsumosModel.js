import db from "../database/db.js";
import { DataTypes } from "sequelize";

const InsumosModel = db.define('insumos', {
    Id_insumo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Nom_Insumo: { type: DataTypes.STRING },
    Tip_Insumo: { type: DataTypes.STRING},
    Responsable: { type: DataTypes.STRING },
    Fec_Insumo: { type: DataTypes.DATE } 
}, {
    freezeTableName: true
})

export default InsumosModel;
