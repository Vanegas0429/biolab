import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const ReservaActividadModel = db.define('ReservaActividad', {
    Id_ReservaActividad: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Id_Reserva: { type: DataTypes.NUMBER},
    Id_Actividad: { type: DataTypes.NUMBER},
}, {
    freezeTableName: true
})
export default ReservaActividadModel;