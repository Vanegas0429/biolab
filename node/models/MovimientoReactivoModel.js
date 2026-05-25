import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MovimientoReactivoModel = db.define('MovimientoReactivo', {
    Id_Movimiento: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    Id_Entrada: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    Id_Reserva: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
    Tipo: { 
        type: DataTypes.ENUM('Entrada', 'Salida', 'Devolución', 'Ajuste'), 
        allowNull: false 
    },
    Cantidad: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    Fecha: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    Detalle: { 
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'movimientoreactivo',
    freezeTableName: true,
    timestamps: false
});

export default MovimientoReactivoModel;
