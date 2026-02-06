import ReservaEquipoModel from "../models/ReservaEquipoModel.js";

class ReservaEquipoService {

    async getAll() {
        return await ReservaEquipoModel.findAll()
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