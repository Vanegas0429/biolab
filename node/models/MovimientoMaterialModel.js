import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MovimientoMaterialModel = db.define('MovimientoMaterial', {
    Id_Movimiento_Material: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    Id_Entrada_Material: { 
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
    tableName: 'movimientomaterial',
    freezeTableName: true,
    timestamps: false
});

export default MovimientoMaterialModel;
