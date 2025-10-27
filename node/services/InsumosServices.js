import InsumosModel from "../models/InsumosModel.js";

class InsumosService {
    async getAll(){
        return await InsumosModel.findAll()
    }
    async getById(id) {

        const insumo = await InsumosModel.findByPk(id)
        if (!insumo) throw new Error ("Insumo no encontrado")
        return insumo
    }
    async create(data) {
        return await InsumosModel.create(data)
    }
    async update(id, data) {
        const result = await InsumosModel.update(data, {where: { Id_insumo: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Insumos no encontrado o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await InsumosModel.destroy({where: { Id_insumo: id }})

        if (!deleted) throw new Error ("Insumo no encontrado")
            return true
    }
}

export default new InsumosService()