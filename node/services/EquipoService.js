import EquipoModel from "../models/EquipoModel.js";

class EquipoService {

    async getAll() {
        return await EquipoModel.findAll();
    }

    async getById(id_equipo) {

        const equipo = await EquipoModel.findOne({
            where: { id_equipo: id_equipo }
        });

        if (!equipo) throw new Error("Equipo no encontrado");

        return equipo;
    }

    async create(data) {
        return await EquipoModel.create(data);
    }

    async update(id_equipo, data) {

        const result = await EquipoModel.update(
            data,
            { where: { id_equipo: id_equipo } }
        );

        const updated = result[0];

        if (updated === 0) {
            throw new Error("Equipo no encontrado o sin cambios");
        }

        return true;
    }

    async delete(id_equipo) {

        const deleted = await EquipoModel.destroy({
            where: { id_equipo: id_equipo }
        });

        if (!deleted) throw new Error("Equipo no encontrado");

        return true;
    }
}

export default new EquipoService();