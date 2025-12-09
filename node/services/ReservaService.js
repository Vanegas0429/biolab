import ReservaModel from "../models/ReservaModel.js";

class PracticaService {
    async getAll(){
        return await ReservaModel.findAll()
    }
    async getById(id) {

        const reserva = await ReservaModel.findByPk(id)
        if (reserva) throw new Error ("Reserva no encontrado")
        return reserva
    }
    async create(data) {
        return await ReservaModel.create(data)
    }
    async update(id, data) {
        const result = await ReservaModel.update(data, {where: { Id_Reserva: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Reserva no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await ReservaModel.destroy({where: { Id_Reserva: id }})

        if (!deleted) throw new Error ("Reserva no encontrada")
            return true
    }
}

export default new PracticaService()