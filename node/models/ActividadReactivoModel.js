import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ActividadReactivoModel = db.define('ActividadReactivo', {
    Id_ActividadReactivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Actividad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Reactivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'actividadreactivo',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ActividadReactivoModel;