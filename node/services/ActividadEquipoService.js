import ActividadEquipoModel from "../models/ActividadEquipoModel.js";

class ActividadEquipoService {

    async getAll() {
        return await ActividadEquipoModel.findAll()
    }

    async getById(id) {

        const ActividadEquipo = await ActividadEquipoModel.findByPk(id)
        if (!ActividadEquipo) throw new Error('ActividadEquipo no encontrado');
        return ActividadEquipo;
    }


    async create(data) {
        return await ActividadEquipoModel.create(data)
    }

    async update(id, data) {

        const result = await ActividadEquipoModel.update(data, { where: {Id_ActividadEquipo : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ActividadEquipo no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ActividadEquipoModel.destroy({ where: { Id_ActividadEquipo: id } });
        if (deleted === 0) throw new Error('ActividadEquipo no encontrado')
        return true
    }
}

export default new ActividadEquipoService()