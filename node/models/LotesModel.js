import db from "../database/db.js";
import { DataTypes } from "sequelize";

const LotesModel = db.define('lotes', {
    Id_lote: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Id_planta: { type: DataTypes.STRING },
    createdat: { type: DataTypes.STRING },
    updatedat: { type: DataTypes.DATE } 
}, {
    freezeTableName: true
})

export default LotesModel;
