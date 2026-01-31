import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const ReservaReactivoModel = db.define('ReservaReactivo', {
    Id_ReservaReactivo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Id_Reserva: { type: DataTypes.NUMBER},
    Id_Reactivo: { type: DataTypes.NUMBER},
    Can_Reactivo: { type: DataTypes.NUMBER},
}, {
    freezeTableName: true
})
export default ReservaReactivoModel;