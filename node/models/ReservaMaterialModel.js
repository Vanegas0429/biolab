import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const ReservaMaterialModel = db.define('ReservaMaterial', {
    Id_ReservaMaterial: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Id_Reserva: { type: DataTypes.NUMBER},
    Id_Material: { type: DataTypes.NUMBER},
    Can_Materiales: { type: DataTypes.NUMBER},
}, {
    freezeTableName: true
})
export default ReservaMaterialModel;