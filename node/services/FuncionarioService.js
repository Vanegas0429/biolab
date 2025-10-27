import FuncionarioModel from "../models/FuncionarioModel.js";

class FuncionarioService {

    async getAll() {
        return await FuncionarioModel.findAll()
    }

    async getById(id) {

        const Funcionario = await FuncionarioModel.findByPk(id)
        if (!Funcionario) throw new Error('Funcionario no encontrado');
        return Funcionario;
    }


    async create(data) {
        return await FuncionarioModel.create(data)
    }

    async update(id, data) {

        const result = await FuncionarioModel.update(data, { where: {Id_Funcionario : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('Funcionario no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await FuncionarioModel.destroy({ where: { Id_Funcionario: id } });
        if (deleted === 0) throw new Error('Funcionario no encontrado')
        return true
    }
}

export default new FuncionarioService()