import ReservaEquipoModel from "../models/ReservaEquipoModel.js";
import ReservaModel from "../models/ReservaModel.js";
import EquipoModel from "../models/EquipoModel.js";

class ReservaEquipoService {

    async getAll() {
        return await ReservaEquipoModel.findAll({
            include: [
                { model: ReservaModel, as: 'Reserva' },
                { model: EquipoModel, as: 'Equipo' }
            ]
        })
    }

    async getById(id) {

        const ReservaEquipo = await ReservaEquipoModel.findByPk(id)
        if (!ReservaEquipo) throw new Error('ReservaEquipo no encontrado');
        return ReservaEquipo;
    }


    async create(data) {
        return await ReservaEquipoModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaEquipoModel.update(data, { where: {Id_ReservaEquipo : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ReservaEquipo no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaEquipoModel.destroy({ where: { Id_ReservaEquipo: id } });
        if (deleted === 0) throw new Error('ReservaEquipo no encontrado')
        return true
    }
}

export default new ReservaEquipoService()