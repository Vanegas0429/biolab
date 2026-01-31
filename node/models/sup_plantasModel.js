import db from "../database/db.js";
import { DataTypes } from "sequelize";

const  Sup_plantasModel= db.define("Sub_plantas",{
    id_supervisionplantas: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    fecha_supervision: { type: DataTypes.TIME},
    estado_planta: {type: DataTypes.CHAR},
    id_funcionario: {type:DataTypes.NUMBER},
    id_planta: {type:DataTypes.NUMBER}
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default Sup_plantasModel;