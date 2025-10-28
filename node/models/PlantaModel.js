import db from "../database/db.js";
import { DataTypes } from "sequelize";

const  EquipoModel= db.define("planta",{
    id_planta: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    especie: { type: DataTypes.STRING},
    met_cultivo: {type: DataTypes.STRING},
    met_propagacion: {type:DataTypes.STRING},
    plan_contaminadas: {type: DataTypes.ENUM("Bacterias","Hongos","No Contaminada")},
    plan_desarrolladas: {type:DataTypes.ENUM("Desarrolada","No desarollada")},
    numero_endurecimiento: { type: DataTypes.NUMBER},
    
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default EquipoModel;