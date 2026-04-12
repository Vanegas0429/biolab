import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ActividadEquipoModel = db.define('ActividadEquipo', {
    Id_ActividadEquipo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Actividad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Equipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'actividadequipo',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ActividadEquipoModel;