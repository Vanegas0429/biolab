import EquipoModel from "../models/EquipoModel.js";

class EquipoService {

    async getAll() { //consultar todos los registros de la tabla
        return await EquipoModel.findAll()
    }

    async getById(id) {

        const Equipo = await EquipoModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!Equipo) throw new Error("Equipo no encontrado")
        return Equipo
    }

    async create(data) {
        return await EquipoModel.create(data)
    }

    async update(id, data) {
        const result = await EquipoModel.update(data, { where: { id_equipo: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Equipo no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await EquipoModel.destroy({ where: { id_equipo: id } })

        if (!deleted) throw new Error("Equipo no encontrado")
        return true
    }
}

export default new EquipoService