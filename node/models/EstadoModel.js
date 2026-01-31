import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const EstadoModel = db.define('Estados', {
    Id_Estado: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Tip_Estado: { type: DataTypes.STRING},
}, {
    freezeTableName: true
})
export default EstadoModel;