import ReservaModel from "../models/ReservaModel.js";

class ReservaService {

    async getAll() {
        return await ReservaModel.findAll()
    }

    async getById(id) {

        const Reserva = await ReservaModel.findByPk(id)
        if (!Reserva) throw new Error('Reserva no encontrado');
        return Reserva;
    }


    async create(data) {
        return await ReservaModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaModel.update(data, { where: {Id_Reserva : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('Reserva no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaModel.destroy({ where: { Id_Reserva: id } });
        if (deleted === 0) throw new Error('Reserva no encontrado')
        return true
    }
}

export default new ReservaService()