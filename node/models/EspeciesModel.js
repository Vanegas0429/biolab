import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EspeciesModel = db.define('especie', {
    Id_especie: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nom_especie: { type: DataTypes.STRING },
    img_especie: { type: DataTypes.TEXT },
    Estado: { type: DataTypes.ENUM('Activo', 'Inactivo') }
}, {
    freezeTableName: true
})

export default EspeciesModel;
