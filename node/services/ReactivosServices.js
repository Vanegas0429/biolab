import ReactivosModel from "../models/ReactivosModel.js";

class ReactivosService {
    async getAll(){
        return await ReactivosModel.findAll()
    }
    async getById(id) {

        const Reactivo = await ReactivosModel.findByPk(id)
        if (!Reactivo) throw new Error ("Reactivo no encontrado")
        return Reactivo
    }
    async create(data) {
        return await ReactivosModel.create(data)
    }
    async update(id, data) {
        const result = await ReactivosModel.update(data, {where: { Id_Reactivo: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Reactivos no encontrado o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await ReactivosModel.destroy({where: { Id_Reactivo: id }})

        if (!deleted) throw new Error ("Reactivo no encontrado")
            return true
    }
}

export default new ReactivosService()