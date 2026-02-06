import db from "../database/db.js";
import { DataTypes } from "sequelize";

const  Sup_plantasModel= db.define("Sup_plantas",{
    Id_supervision: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Num_lote: { type: DataTypes.ENUM('1','2','3')},
    Med_Cultivo: { type: DataTypes.ENUM('MyS','MyS carbon')},
    Met_Propagacion: { type: DataTypes.ENUM('Siembra', 'Repique')},
    Fc_Iniciales: { type: DataTypes.NUMBER},
    Fra_Contaminados: { type: DataTypes.NUMBER},
    Fc_Bacterias: { type: DataTypes.NUMBER},
    Fc_Hongos: { type: DataTypes.NUMBER},
    Fra_Desarrollo: { type: DataTypes.NUMBER},
    Fd_BR: {type: DataTypes.NUMBER},
    Fd_RA: {type: DataTypes.NUMBER},    
    Fd_CA: {type: DataTypes.NUMBER},
    Fd_MOR: {type: DataTypes.NUMBER},
    Fd_GER: {type: DataTypes.NUMBER},
    Num_endurecimiento: {type: DataTypes.NUMBER},
    Id_produccion: {type:DataTypes.NUMBER},     
    Id_especie: {type:DataTypes.NUMBER}
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default Sup_plantasModel;    