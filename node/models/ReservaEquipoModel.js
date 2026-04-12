import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaEquipoModel = db.define('ReservaEquipo', {
    Id_ReservaEquipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Equipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Can_Equipos: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'reservaequipo',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaEquipoModel;