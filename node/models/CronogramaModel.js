import db from "../database/db.js";
import { DataTypes } from "sequelize";

const CronogramaModel= db.define("cronograma",{
    Id_Cronograma: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    ID_Funcionario: { type: DataTypes.NUMBER},
    Num_Ficha: {type: DataTypes.NUMBER},
    Can_Aprendices: {type:DataTypes.NUMBER},
    Act_Realizada: { type: DataTypes.STRING},
    id_equipo: {type: DataTypes.NUMBER},
    
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default CronogramaModel;