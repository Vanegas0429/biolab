import ActividadMaterialModel from "../models/ActividadMaterialModel.js";
import MaterialModel from "../models/MaterialModel.js";
import ActividadModel from "../models/ActividadModel.js";

class ActividadMaterialService {

    async getAll() {
        return await ActividadMaterialModel.findAll(
            {
                include: [{
                    model: ActividadModel,
                    as: 'actividad'
                }, 
                {
                    model: MaterialModel,
                    as: 'Material'
                }]
            }
        )
    }

    async getById(id) {

        const ActividadMaterial = await ActividadMaterialModel.findByPk(id)
        if (!ActividadMaterial) throw new Error('ActividadMaterial no encontrado');
        return ActividadMaterial;
    }


    async create(data) {
        return await ActividadMaterialModel.create(data)
    }

    async update(id, data) {

        const result = await ActividadMaterialModel.update(data, { where: {Id_ActividadMaterial : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ActividadMaterial no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ActividadMaterialModel.destroy({ where: { Id_ActividadMaterial: id } });
        if (deleted === 0) throw new Error('ActividadMaterial no encontrado')
        return true
    }
}

export default new ActividadMaterialService()