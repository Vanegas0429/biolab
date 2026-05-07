import ProduccionModel from "../models/ProduccionModel.js";
import EspeciesModel from "../models/EspeciesModel.js";

class ProduccionService {
    async getAll(){
        try {
            return await ProduccionModel.findAll({
                include: [{
                    model: EspeciesModel,
                    as: 'Especie'
                }]
            })
        } catch (error) {
            console.error("Error in ProduccionService.getAll:", error);
            throw error;
        }
    }
    async getById(id) {

        const Produccion = await ProduccionModel.findByPk(id)
        if (!Produccion) throw new Error ("Produccion no encontrada")
        return Produccion
    }
    async create(data) {
        return await ProduccionModel.create(data)
    }
    async update(id, data) {
        const result = await ProduccionModel.update(data, {where: { Id_produccion: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Produccion no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await ProduccionModel.destroy({where: { Id_produccion: id }})

        if (!deleted) throw new Error ("Produccion no encontrada")
            return true
    }
}

export default new ProduccionService()