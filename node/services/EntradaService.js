import EntradaModel from "../models/EntradaModel.js";
import ReactivosModel from "../models/ReactivosModel.js";
import MovimientoReactivoModel from "../models/MovimientoReactivoModel.js";

class EntradaService {
    async getAll(){
        return await EntradaModel.findAll(
            {
                include: [{
                    model: ReactivosModel,
                    as: 'Reactivo'
                }]
            }
        )
    }
    async getById(id) {
        const Entrada = await EntradaModel.findByPk(id)
        if (!Entrada) throw new Error ("Entrada no encontrado")
        return Entrada
    }
    async create(data) {
        if (data.Can_Existente === undefined || data.Can_Existente === null || data.Can_Existente === '') {
            data.Can_Existente = data.Can_Inicial;
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
        const deleted = await EntradaModel.destroy({where: { Id_Entrada: id }})
        if (!deleted) throw new Error ("Entrada no encontrada")
        return true;
    }
}

export default new EntradaService()