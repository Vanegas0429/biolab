import db from "../database/db.js";
import { DataTypes } from "sequelize";

const  Sup_plantasModel= db.define("Sup_plantas",{
    Id_supervision: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Num_lote: { type: DataTypes.ENUM('1','2','3')},
    Med_Cultivo: { type: DataTypes.ENUM('MyS','MyS carbon')},
    Met_Propagacion: { type: DataTypes.ENUM('Siembra', 'Repique')},
    Fc_Iniciales: { type: DataTypes.INTEGER},
    Fra_Contaminados: { type: DataTypes.INTEGER},
    Fc_Bacterias: { type: DataTypes.INTEGER},
    Fc_Hongos: { type: DataTypes.INTEGER},
    Fs_Desarrollo: { type: DataTypes.INTEGER},
    Fra_Desarrollo: { type: DataTypes.INTEGER},
    Fd_BR: {type: DataTypes.INTEGER},
    Fd_RA: {type: DataTypes.INTEGER},    
    Fd_CA: {type: DataTypes.INTEGER},
    Fd_MOR: {type: DataTypes.INTEGER},
    Fd_GER: {type: DataTypes.INTEGER},
    Num_endurecimiento: {type: DataTypes.INTEGER},
    Estado: {type: DataTypes.ENUM('Activo','Inactivo')},
    Id_produccion: {type:DataTypes.INTEGER},     
}, {
    //evitar prularizacion en la gestion de la tabla 
    freezeTableName: true
})

export default Sup_plantasModel;    