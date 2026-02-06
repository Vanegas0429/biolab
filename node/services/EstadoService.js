import EstadoModel from "../models/EstadoModel.js";

class EstadoService {

    async getAll() {
        return await EstadoModel.findAll()
    }

    async getById(id) {

        const Estado = await EstadoModel.findByPk(id)
        if (!Estado) throw new Error('Estado no encontrado');
        return Estado;
    }


    async create(data) {
        return await EstadoModel.create(data)
    }

    async update(id, data) {

        const result = await EstadoModel.update(data, { where: {Id_Estado : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('Estado no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await EstadoModel.destroy({ where: { Id_Estado: id } });
        if (deleted === 0) throw new Error('Estado no encontrado')
        return true
    }
}

export default new EstadoService()