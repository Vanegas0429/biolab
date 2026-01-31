import ReservaActividadModel from "../models/ReservaActividadModel.js";

class ReservaActividadService {

    async getAll() {
        return await ReservaActividadModel.findAll()
    }

    async getById(id) {

        const ReservaActividad = await ReservaActividadModel.findByPk(id)
        if (!ReservaActividad) throw new Error('ReservaActividad no encontrado');
        return ReservaActividad;
    }


    async create(data) {
        return await ReservaActividadModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaActividadModel.update(data, { where: {Id_ReservaActividad : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ReservaActividad no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaActividadModel.destroy({ where: { Id_ReservaActividad: id } });
        if (deleted === 0) throw new Error('ReservaActividad no encontrado')
        return true
    }
}

export default new ReservaActividadService()