import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const FuncionarioModel = db.define('Funcionario', {
    Id_Funcionario: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Nombre: { type: DataTypes.STRING},
    Apellido: { type: DataTypes.STRING},
    Telefono: { type: DataTypes.NUMBER},
    Correo: { type: DataTypes.STRING},
    Cargo_Funcionario: { type: DataTypes.CHAR},
}, {
    freezeTableName: true
})
export default FuncionarioModel;