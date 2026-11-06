import EntradaModel from "../models/EntradaModel.js";
import ReactivosModel from "../models/ReactivosModel.js";
import MovimientoReactivoModel from "../models/MovimientoReactivoModel.js";
import { Op } from "sequelize";

class EntradaService {
    async getAll(){
        // Auto-inactivar entradas vencidas o con cantidad existente <= 0
        try {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const todayStr = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

            await EntradaModel.update(
                { Estado: 'Inactivo' },
                {
                    where: {
                        Estado: 'Activo',
                        [Op.or]: [
                            { Can_Existente: { [Op.lte]: 0 } },
                            { Fec_Vencimiento: { [Op.lt]: todayStr } }
                        ]
                    }
                }
            );
        } catch (err) {
            console.error("Error auto-inactivando entradas de reactivos:", err);
        }

        // Siempre ordenar descendente para que la nueva entrada aparezca en el primer registro
        return await EntradaModel.findAll(
            {
                include: [{
                    model: ReactivosModel,
                    as: 'Reactivo'
                }],
                order: [
                    ['Id_Entrada', 'DESC']
                ]
            }
        );
    }

    async getById(id) {
        const Entrada = await EntradaModel.findByPk(id);
        if (!Entrada) throw new Error ("Entrada no encontrado");
        return Entrada;
    }

    async create(data) {
        if (data.Can_Existente === undefined || data.Can_Existente === null || data.Can_Existente === '') {
            data.Can_Existente = data.Can_Inicial;
        }

        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const todayStr = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

        // Inactivar automáticamente si la cantidad existente es 0 o si ya está vencido
        if (Number(data.Can_Existente) <= 0 || (data.Fec_Vencimiento && String(data.Fec_Vencimiento).split('T')[0] < todayStr)) {
            data.Estado = 'Inactivo';
        }

        const newEntrada = await EntradaModel.create(data);
        
        // Log movement
        await MovimientoReactivoModel.create({
            Id_Entrada: newEntrada.Id_Entrada,
            Tipo: 'Entrada',
            Cantidad: newEntrada.Can_Inicial,
            Detalle: 'Registro inicial de entrada'
        });

        return newEntrada;
    }

    async update(id, data) {
        const oldEntrada = await EntradaModel.findByPk(id);
        if (!oldEntrada) throw new Error("Entrada no encontrada");

        const oldCanExistente = Number(oldEntrada.Can_Existente || 0);
        const newCanExistente = data.Can_Existente !== undefined && data.Can_Existente !== null && data.Can_Existente !== ''
            ? Number(data.Can_Existente)
            : oldCanExistente;

        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const todayStr = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

        const fecVenc = data.Fec_Vencimiento ? String(data.Fec_Vencimiento).split('T')[0] : (oldEntrada.Fec_Vencimiento ? String(oldEntrada.Fec_Vencimiento).split('T')[0] : null);

        // Inactivar automáticamente si la cantidad existente es 0 o si está vencido
        if (newCanExistente <= 0 || (fecVenc && fecVenc < todayStr)) {
            data.Estado = 'Inactivo';
        }

        const result = await EntradaModel.update(data, { where: { Id_Entrada: id } });
        
        const diff = newCanExistente - oldCanExistente;
        if (diff !== 0) {
            await MovimientoReactivoModel.create({
                Id_Entrada: id,
                Tipo: diff > 0 ? 'Devolución' : 'Salida',
                Cantidad: Math.abs(diff),
                Detalle: `Ajuste manual de stock (de ${oldCanExistente} a ${newCanExistente})`
            });
        }

        return true;
    }

    async delete(id) {
        const deleted = await EntradaModel.destroy({where: { Id_Entrada: id }});
        if (!deleted) throw new Error ("Entrada no encontrada");
        return true;
    }
}

export default new EntradaService();
