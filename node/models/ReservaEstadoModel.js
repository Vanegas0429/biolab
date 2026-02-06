import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const ReservaEstadoModel = db.define('ReservaEstado', {
    Id_ReservaEstado: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Id_Reserva: { type: DataTypes.NUMBER},
    Id_Estado: { type: DataTypes.NUMBER},
}, {
    freezeTableName: true
})
export default ReservaEstadoModel;