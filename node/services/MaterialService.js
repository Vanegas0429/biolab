import MaterialModel from "../models/MaterialModel.js";

class MaterialService {
    async getAll(){
        return await MaterialModel.findAll()
    }
    async getById(id) {

        const Material = await MaterialModel.findByPk(id)
        if (!Material) throw new Error ("Material no encontrada")
        return Material
    }
    async create(data) {
        return await MaterialModel.create(data)
    }
    async update(id, data) {
        const result = await MaterialModel.update(data, {where: { Id_Material: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Material no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await MaterialModel.destroy({where: { Id_Material: id }})

        if (!deleted) throw new Error ("Material no encontrada")
            return true
    }
}

export default new MaterialService()