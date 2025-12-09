import PracticaModel from "../models/PracticaModel.js";
import ReservaModel from "../models/ReservaModel.js";

class PracticaService {
    async getAll(){
        return await PracticaModel.findAll(
            {
                include: [{
                    model: ReservaModel,
                    as: 'Reserva'
                }]
            }
        )
    }
    async getById(id) {

        const practica = await PracticaModel.findByPk(id)
        if (!practica) throw new Error ("Practica no encontrado")
        return practica
    }
    async create(data) {
        return await PracticaModel.create(data)
    }
    async update(id, data) {
        const result = await PracticaModel.update(data, {where: { Id_Practica: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Practica no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await PracticaModel.destroy({where: { Id_Practica: id }})

        if (!deleted) throw new Error ("Practica no encontrada")
            return true
    }
}

export default new PracticaService()