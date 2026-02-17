import db from "../database/db.js";
import { DataTypes } from "sequelize";

const PracticaModel = db.define('practica', {
    Id_Practica: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Id_Reserva: { type: DataTypes.NUMBER},
    Estado: { type: DataTypes.ENUM('Activo','Inactivo')}
    
}, {

    freezeTableName: true
})

export default PracticaModel;
