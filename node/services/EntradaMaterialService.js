import EntradaMaterialModel from "../models/EntradaMaterialModel.js";
import MaterialModel from "../models/MaterialModel.js";
import MovimientoMaterialModel from "../models/MovimientoMaterialModel.js";

class EntradaMaterialService {
    async getAll() {
        return await EntradaMaterialModel.findAll({
            include: [{
                model: MaterialModel,
                as: 'Material'
            }],
            order: [['createdAt', 'DESC']]
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

        await EntradaMaterialModel.update(data, { where: { Id_Entrada_Material: id } });

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
        if (!idMaterial) return;
        const entradas = await EntradaMaterialModel.findAll({
            where: {
                Id_Material: idMaterial,
                Estado: 'Activo'
            }
        });
        const totalStock = entradas.reduce((sum, item) => sum + Number(item.Can_Existente || 0), 0);
        await MaterialModel.update(
            { Can_Material: totalStock },
            { where: { Id_Material: idMaterial } }
        );
    }
}

export default new EntradaMaterialService();
