import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ReservaModel = db.define('Reserva', {
    Id_Reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Tip_Reserva: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    Nom_Solicitante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Doc_Solicitante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Tel_Solicitante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Cor_Solicitante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Can_Aprendices: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Fec_Reserva: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Hor_Reserva: {
        type: DataTypes.TIME,
        allowNull: false
    },
    Num_Ficha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Booleano: { type: DataTypes.ENUM('Activo', 'Inactivo') }

}, {
    tableName: 'reserva',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ReservaModel;