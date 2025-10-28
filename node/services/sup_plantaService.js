import sup_plantasModel from "../models/sup_plantasModel.js";

class sup_plantasService {

    async getAll() { //consultar todos los registros de la tabla
        return await sup_plantasModel.findAll()
    }

    async getById(id) {

        const sup_plantas = await sup_plantasModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!sup_plantas) throw new Error("Jugador no encontrado")
        return sup_plantas
    }

    async create(data) {
        return await sup_plantasModel.create(data)
    }

    async update(id, data) {
        const result = await sup_plantasModel.update(data, { where: { id_supervisionplantas: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Jugador no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await sup_plantasModel.destroy({ where: { id_supervisionplantas: id } })

        if (!deleted) throw new Error("Jugador no encontrado")
        return true
    }
}

export default new sup_plantasService