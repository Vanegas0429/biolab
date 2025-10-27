import db from '../database/db.js';
import { DataTypes, TIME } from 'sequelize';

const FuncionarioModel = db.define('Funcionario', {
    Id_Funcionario: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Cargo_Funcionario: { type: DataTypes.CHAR},
}, {
    freezeTableName: true
})
export default FuncionarioModel;