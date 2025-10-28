import LotesModel from "../models/LotesModel.js";

class LotesService {
    async getAll(){
        return await LotesModel.findAll()
    }
    async getById(id) {

        const lote = await LotesModel.findByPk(id)
        if (!lote) throw new Error ("lote no encontrado")
        return lote
    }
    async create(data) {
        return await LotesModel.create(data)
    }
    async update(id, data) {
        const result = await LotesModel.update(data, {where: { Id_lote: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Lotes no encontrado o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await LotesModel.destroy({where: { Id_lote: id }})

        if (!deleted) throw new Error ("lote no encontrado")
            return true
    }
}

export default new LotesService()