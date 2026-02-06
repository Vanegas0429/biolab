import EspecieModel from "../models/EspeciesModel.js";

class EspecieService {
    async getAll(){
        return await EspecieModel.findAll()
    }
    async getById(id) {

        const Especie = await EspecieModel.findByPk(id)
        if (!Especie) throw new Error ("Especie no encontrada")
        return Especie
    }
    async create(data) {
        return await EspecieModel.create(data)
    }
    async update(id, data) {
        const result = await EspecieModel.update(data, {where: { Id_especie: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Especie no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await EspecieModel.destroy({where: { Id_especie: id }})

        if (!deleted) throw new Error ("Especie no encontrada")
            return true
    }
}

export default new EspecieService()