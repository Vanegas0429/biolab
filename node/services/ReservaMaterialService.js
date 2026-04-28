import ReservaMaterialModel from "../models/ReservaMaterialModel.js";
import ReservaModel from "../models/ReservaModel.js";
import MaterialModel from "../models/MaterialModel.js";

class ReservaMaterialService {

    async getAll() {
        return await ReservaMaterialModel.findAll({
            include: [
                { model: ReservaModel, as: 'Reserva' },
                { model: MaterialModel, as: 'Material' }
            ]
        })
    }

    async getById(id) {

        const ReservaMaterial = await ReservaMaterialModel.findByPk(id)
        if (!ReservaMaterial) throw new Error('ReservaMaterial no encontrado');
        return ReservaMaterial;
    }


    async create(data) {
        return await ReservaMaterialModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaMaterialModel.update(data, { where: {Id_ReservaMaterial : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ReservaMaterial no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaMaterialModel.destroy({ where: { Id_ReservaMaterial: id } });
        if (deleted === 0) throw new Error('ReservaMaterial no encontrado')
        return true
    }
}

export default new ReservaMaterialService()