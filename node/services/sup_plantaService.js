import ProduccionModel from "../models/ProduccionModel.js";
import sup_plantasModel from "../models/sup_plantasModel.js";

class sup_plantasService {

    async getAll() { //consultar todos los registros de la tabla
        return await sup_plantasModel.findAll(
            {
                include: [{
                    model: ProduccionModel,
                    as: 'Produccion'
                }]
            }
        )
    }


    async getById(id) {

        const sup_plantas = await sup_plantasModel.findByPk(id)   //consultar registro por llave primaria (PK)
        if (!sup_plantas) throw new Error("Plantas no encontrado")
        return sup_plantas
    }

    async create(data) {
        if (data.Fra_Contaminados === undefined || data.Fra_Contaminados === null) {
            data.Fra_Contaminados = Number(data.Fc_Bacterias || 0) + Number(data.Fc_Hongos || 0);
        }
        const supervision = await sup_plantasModel.create(data);

        // Descontar plantas contaminadas de la producción existente
        if (data.Id_produccion) {
            try {
                const prod = await ProduccionModel.findByPk(data.Id_produccion);
                if (prod) {
                    const iniciales = Number(data.Fc_Iniciales !== undefined && data.Fc_Iniciales !== null && data.Fc_Iniciales !== '' ? data.Fc_Iniciales : (prod.Can_Existente || 0));
                    const contaminados = Number(data.Fra_Contaminados || 0);
                    const restante = Math.max(0, iniciales - contaminados);
                    await ProduccionModel.update(
                        { Can_Existente: restante },
                        { where: { Id_produccion: data.Id_produccion } }
                    );
                }
            } catch (err) {
                console.error("Error al actualizar Can_Existente:", err);
            }
        }

        return supervision;
    }

    async update(id, data) {
        const result = await sup_plantasModel.update(data, { where: { id_supervision: id } })
        //El metodo update del ORM devuelve una promesa en forma de arreglo y la posicion 0 envia el numero de filas afectadas
        const update = result[0]

        if (update === 0) throw new Error("Plantas no encontrado o sin cambios")  //Si el numero de filas afectadas es cero se lanza un error

        return true
    }

    async delete(id) {
        const deleted = await sup_plantasModel.destroy({ where: { id_supervision: id } })

        if (!deleted) throw new Error("Plantas no encontrado")
        return true
    }
}

export default new sup_plantasService