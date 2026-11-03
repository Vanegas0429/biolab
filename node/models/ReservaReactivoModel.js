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
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Reac_Utilizados: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    Reac_Devueltos: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    }
}, {
    tableName: 'reservareactivo',
    freezeTableName: true,
    timestamps: true,
});

export default ReservaReactivoModel;
