import CronogramaModel from "../models/CronogramaModel.js";

class CronogramaService {

    async getAll() { //consultar todos los registros de la tabla
        return await CronogramaModel.findAll()
    }

    async getById(id) {

        const Equipo = await CronogramaModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!Equipo) throw new Error("Equipo no encontrado")
        return Equipo
    }

    async create(data) {
        return await CronogramaModel.create(data)
    }

    async update(id, data) {
        const result = await CronogramaModel.update(data, { where: { Id_Cronograma: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Eqquipo no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await CronogramaModel.destroy({ where: { Id_Cronograma: id } })

        if (!deleted) throw new Error("Equipo no encontrado")
        return true
    }
}

export default new CronogramaService