import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaMaterialModel = db.define('ReservaMaterial', {
    Id_ReservaMaterial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Reserva: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Material: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Can_Materiales: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'reservamaterial',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaMaterialModel;