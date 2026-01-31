import ReservaEstadoModel from "../models/ReservaEstadoModel.js";

class ReservaEstadoService {

    async getAll() {
        return await ReservaEstadoModel.findAll()
    }

    async getById(id) {

        const ReservaEstado = await ReservaEstadoModel.findByPk(id)
        if (!ReservaEstado) throw new Error('ReservaEstado no encontrado');
        return ReservaEstado;
    }


    async create(data) {
        return await ReservaEstadoModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaEstadoModel.update(data, { where: {Id_ReservaEstado : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ReservaEstado no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaEstadoModel.destroy({ where: { Id_ReservaEstado: id } });
        if (deleted === 0) throw new Error('ReservaEstado no encontrado')
        return true
    }
}

export default new ReservaEstadoService()