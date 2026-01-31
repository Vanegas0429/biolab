import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const ReservaEquipoModel = db.define('ReservaEquipo', {
    Id_ReservaEquipo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Id_Reserva: { type: DataTypes.NUMBER},
    Id_Equipo: { type: DataTypes.NUMBER},
    Can_Equipos: { type: DataTypes.NUMBER},
}, {
    freezeTableName: true
})
export default ReservaEquipoModel;