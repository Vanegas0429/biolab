import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaActividadModel = db.define('ReservaActividad', {
    Id_ReservaActividad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Actividad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'reservaactividad',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaActividadModel;