import db from "../database/db.js";
import { DataTypes } from "sequelize";

const  UsoEquipoModel= db.define("uso_equipos",{
    id_usoequipo: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    hora_inicio: { type: DataTypes.TIME},
    hora_fin: {type: DataTypes.TIME},
    actividad_realizada: {type:DataTypes.STRING},
    id_equipo: {type:DataTypes.NUMBER}
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default UsoEquipoModel;