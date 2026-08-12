import db from "../database/db.js";
import { DataTypes } from "sequelize";
import MaterialModel from "./MaterialModel.js";

const EntradaMaterialModel = db.define('entrada_materiales', {
    Id_Entrada_Material: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Id_Material: { type: DataTypes.INTEGER },
    Can_Inicial: { type: DataTypes.INTEGER },
    Can_Existente: { type: DataTypes.INTEGER },
    Estado: { type: DataTypes.ENUM("Activo", "Inactivo"), defaultValue: "Activo" }
}, {
    freezeTableName: true,
    timestamps: true
});

EntradaMaterialModel.belongsTo(MaterialModel, { foreignKey: 'Id_Material', as: 'Material' });
MaterialModel.hasMany(EntradaMaterialModel, { foreignKey: 'Id_Material', as: 'Entradas' });

export default EntradaMaterialModel;
