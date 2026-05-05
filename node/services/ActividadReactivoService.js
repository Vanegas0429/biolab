import ActividadReactivoModel from "../models/ActividadReactivoModel.js";
import ReactivosModel from "../models/ReactivosModel.js";
import ActividadModel from "../models/ActividadModel.js";

class ActividadReactivoService {

    async getAll() {
        return await ActividadReactivoModel.findAll(
            {
                include: [{
                    model: ActividadModel,
                    as: 'Actividad'
                }, 
                {
                    model: ReactivosModel,
                    as: 'Reactivo'
                }]
            }
        )
    }

    async getById(id) {

        const ActividadReactivo = await ActividadReactivoModel.findByPk(id)
        if (!ActividadReactivo) throw new Error('ActividadReactivo no encontrado');
        return ActividadReactivo;
    }


    async create(data) {
        return await ActividadReactivoModel.create(data)
    }

    async update(id, data) {

        const result = await ActividadReactivoModel.update(data, { where: {Id_ActividadReactivo : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ActividadReactivo no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ActividadReactivoModel.destroy({ where: { Id_ActividadReactivo: id } });
        if (deleted === 0) throw new Error('ActividadReactivo no encontrado')
        return true
    }
}

export default new ActividadReactivoService()