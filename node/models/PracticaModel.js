import db from "../database/db.js";
import { DataTypes } from "sequelize";

const PracticaModel = db.define('practica', {
    Id_Practica: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id_Reserva: { type: DataTypes.INTEGER},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}
}, {
    freezeTableName: true
})

export default PracticaModel;
