import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ReservaModel = db.define('reserva', {
    Id_Reserva: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Tip_Reserva: {type: DataTypes.ENUM("Practica","Visita")},
    Nom_Solicitante: {type: DataTypes.STRING},
    Doc_Solicitante: {type: DataTypes.NUMBER},
    Tel_Solicitante: {type: DataTypes.NUMBER},
    Cor_Solicitante: {type: DataTypes.STRING},
    Can_Aprendices: {type: DataTypes.NUMBER},
    Fec_Reserva: {type: DataTypes.DATE},
    Hor_Reserva: {type: DataTypes.TIME},
    Num_Ficha: {type: DataTypes.NUMBER},

}, {

    freezeTableName: true
})

export default ReservaModel;
