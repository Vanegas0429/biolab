import EntradaModel from "../models/EntradaModel.js";
import ReactivosModel from "../models/ReactivosModel.js";

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
        return await EntradaModel.create(data)
    }
    async update(id, data) {
        const result = await EntradaModel.update(data, {where: { Id_Entrada: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Entrada no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await EntradaModel.destroy({where: { Id_Entrada: id }})

        if (!deleted) throw new Error ("Entrada no encontrada")
            return true
    }
}

export default new EntradaService()