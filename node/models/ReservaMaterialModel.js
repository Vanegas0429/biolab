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
    },
    Mat_Utilizados: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    Mat_Devueltos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'reservamaterial',
    freezeTableName: true,
    timestamps: true,
});

export default ReservaMaterialModel;