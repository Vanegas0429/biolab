import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaReactivoModel = db.define('ReservaReactivo', {
    Id_ReservaReactivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Can_Reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Reac_Utilizados: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    Reac_Devueltos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'reservareactivo',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaReactivoModel;