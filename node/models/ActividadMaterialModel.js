import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ActividadMaterialModel = db.define('ActividadMaterial', {
    Id_ActividadMaterial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Actividad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_Material: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'actividadmaterial',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

export default ActividadMaterialModel;