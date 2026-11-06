import EntradaMaterialModel from "../models/EntradaMaterialModel.js";
import MaterialModel from "../models/MaterialModel.js";
import MovimientoMaterialModel from "../models/MovimientoMaterialModel.js";
import { Op } from "sequelize";

class EntradaMaterialService {
    async getAll() {
        // Auto-inactivar entradas con cantidad existente <= 0
        try {
            await EntradaMaterialModel.update(
                { Estado: 'Inactivo' },
                {
                    where: {
                        Estado: 'Activo',
                        Can_Existente: { [Op.lte]: 0 }
                    }
                }
            );
        } catch (err) {
            console.error("Error auto-inactivando entradas de materiales:", err);
        }

        // Siempre ordenar descendente para que la nueva entrada aparezca en el primer registro
        return await EntradaMaterialModel.findAll({
            include: [{
                model: MaterialModel,
                as: 'Material'
            }],
            order: [
                ['Id_Entrada_Material', 'DESC']
            ]
        });
    }

    async getById(id) {
        const entrada = await EntradaMaterialModel.findByPk(id, {
            include: [{ model: MaterialModel, as: 'Material' }]
        });
        if (!entrada) throw new Error("Entrada de material no encontrada");
        return entrada;
    }

    async create(data) {
        if (data.Can_Existente === undefined || data.Can_Existente === null || data.Can_Existente === '') {
            data.Can_Existente = data.Can_Inicial;
        }

        // Inactivar automáticamente si la cantidad es 0
        if (Number(data.Can_Existente) <= 0) {
            data.Estado = 'Inactivo';
        }

        const newEntrada = await EntradaMaterialModel.create(data);

        // Log movement
        try {
            await MovimientoMaterialModel.create({
                Id_Entrada_Material: newEntrada.Id_Entrada_Material,
                Tipo: 'Entrada',
                Cantidad: newEntrada.Can_Inicial,
                Detalle: 'Ingreso inicial de lote de material'
            });
        } catch (e) {
            console.error("Error al registrar movimiento de entrada de material:", e);
        }

        // Actualizar stock total en la tabla de materiales
        await this.recalcularStockMaterial(newEntrada.Id_Material);

        return newEntrada;
    }

    async update(id, data) {
        const oldEntrada = await EntradaMaterialModel.findByPk(id);
        if (!oldEntrada) throw new Error("Entrada de material no encontrada");

        const oldQty = Number(oldEntrada.Can_Existente ?? oldEntrada.Can_Inicial ?? 0);
        const newQty = data.Can_Existente !== undefined && data.Can_Existente !== null ? Number(data.Can_Existente) : oldQty;
        const diff = oldQty - newQty;

        // Inactivar automáticamente si la cantidad existente es 0
        if (newQty <= 0) {
            data.Estado = 'Inactivo';
        }

        await EntradaMaterialModel.update(data, { where: { Id_Entrada_Material: id } });

        // Registrar movimiento de Ajuste si la cantidad existente cambió
        if (diff !== 0) {
            try {
                let detalleMsg = data.Motivo_Ajuste;
                if (!detalleMsg) {
                    detalleMsg = diff > 0 
                        ? `Descuento manual / baja (${oldQty} -> ${newQty})`
                        : `Incremento manual (${oldQty} -> ${newQty})`;
                }
                await MovimientoMaterialModel.create({
                    Id_Entrada_Material: id,
                    Tipo: 'Ajuste',
                    Cantidad: Math.abs(diff),
                    Detalle: detalleMsg
                });
            } catch (e) {
                console.error("Error al registrar movimiento de ajuste de material:", e);
            }
        }

        // Recalcular stock
        await this.recalcularStockMaterial(oldEntrada.Id_Material);
        if (data.Id_Material && Number(data.Id_Material) !== Number(oldEntrada.Id_Material)) {
            await this.recalcularStockMaterial(data.Id_Material);
        }

        return true;
    }

    async delete(id) {
        const entrada = await EntradaMaterialModel.findByPk(id);
        if (!entrada) throw new Error("Entrada de material no encontrada");

        const materialId = entrada.Id_Material;
        await EntradaMaterialModel.destroy({ where: { Id_Entrada_Material: id } });

        // Recalcular stock
        await this.recalcularStockMaterial(materialId);

        return true;
    }

    async recalcularStockMaterial(idMaterial) {
        try {
            const entradas = await EntradaMaterialModel.findAll({
                where: {
                    Id_Material: idMaterial,
                    Estado: 'Activo'
                }
            });

            const totalStock = entradas.reduce((sum, item) => sum + Number(item.Can_Existente ?? item.Can_Inicial ?? 0), 0);

            await MaterialModel.update(
                { Can_Material: totalStock },
                { where: { Id_Material: idMaterial } }
            );
        } catch (e) {
            console.error(`Error recalculando stock de material ${idMaterial}:`, e);
        }
    }
}

export default new EntradaMaterialService();
