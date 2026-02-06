import EquipoModel from "../models/EquipoModel.js";

class EquipoService {

    async getAll() { //consultar todos los registros de la tabla
        return await EquipoModel.findAll()
    }

    async getById(id_equipo) {

        const Equipo = await EquipoModel.findByPk(id_equipo)   //consultar registro por llave primaria (PK)
        if (!Equipo) throw new Error("Equipo no encontrado")
        return Equipo
    }

    async create(data) {
        return await EquipoModel.create(data)
    }

    async update(id_equipo, data) {
        const result = await EquipoModel.update(data, { where: { id_equipo_equipo: id_equipo } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Equipo no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id_equipo) {
        const deleted = await EquipoModel.destroy({ where: { id_equipo_equipo: id_equipo } })

        if (!deleted) throw new Error("Equipo no encontrado")
        return true
    }
}

export default new EquipoService