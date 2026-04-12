import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const ActividadModel = db.define('Actividad', {
    Id_Actividad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nom_Actividad: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'actividades',
    freezeTableName: true,
    timestamps: false
});

export default ActividadModel;