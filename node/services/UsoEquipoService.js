import UsoEquipoModel from "../models/UsoEquipoModel.js";

class UsoEquipoService {

    async getAll() { //consultar todos los registros de la tabla
        return await UsoEquipoModel.findAll()
    }

    async getById(id) {

        const usoEquipo = await UsoEquipoModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!usoEquipo) throw new Error("Jugador no encontrado")
        return usoEquipo
    }

    async create(data) {
        return await UsoEquipoModel.create(data)
    }

    async update(id, data) {
        const result = await UsoEquipoModel.update(data, { where: { id_usoequipo: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Jugador no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await UsoEquipoModel.destroy({ where: { id_usoequipo: id } })

        if (!deleted) throw new Error("Jugador no encontrado")
        return true
    }
}

export default new UsoEquipoService