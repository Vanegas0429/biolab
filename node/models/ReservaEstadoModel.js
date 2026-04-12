import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaEstadoModel = db.define('ReservaEstado', {
    Id_ReservaEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Mot_RecCan: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reservaestado',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaEstadoModel;