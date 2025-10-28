import PlantaModel from "../models/PlantaModel.js";

class PlantaService {

    async getAll() { //consultar todos los registros de la tabla
        return await PlantaModel.findAll()
    }

    async getById(id) {

        const Planta = await PlantaModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!Planta) throw new Error("Planta no encontrado")
        return Planta
    }

    async create(data) {
        return await PlantaModel.create(data)
    }

    async update(id, data) {
        const result = await PlantaModel.update(data, { where: { id_planta: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Planta no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await PlantaModel.destroy({ where: { id_planta: id } })

        if (!deleted) throw new Error("Planta no encontrado")
        return true
    }
}

export default new PlantaService