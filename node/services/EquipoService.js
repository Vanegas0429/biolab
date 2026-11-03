import EquipoModel from "../models/EquipoModel.js";

class EquipoService {

    async getAll() {
        return await EquipoModel.findAll();
    }

    async getById(Id_Equipo) {
        const equipo = await EquipoModel.findOne({
            where: { Id_Equipo: Id_Equipo }
        });

        if (!equipo) throw new Error("Equipo no encontrado");

        return equipo;
    }

    async create(data) {
        if (data.nombre && typeof data.nombre === 'string') {
            const trimmed = data.nombre.trim();
            if (trimmed) {
                data.nombre = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        if (data.linea && typeof data.linea === 'string') {
            const trimmed = data.linea.trim();
            if (trimmed) {
                data.linea = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        return await EquipoModel.create(data);
    }

    async update(Id_Equipo, data) {
        if (data.nombre && typeof data.nombre === 'string') {
            const trimmed = data.nombre.trim();
            if (trimmed) {
                data.nombre = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        if (data.linea && typeof data.linea === 'string') {
            const trimmed = data.linea.trim();
            if (trimmed) {
                data.linea = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }

        const result = await EquipoModel.update(
            data,
            { where: { Id_Equipo: Id_Equipo } }
        );

        const updated = result[0];

        if (updated === 0) {
            throw new Error("Equipo no encontrado o sin cambios");
        }

        return true;
    }

    async delete(Id_Equipo) {
        const deleted = await EquipoModel.destroy({
            where: { Id_Equipo: Id_Equipo }
        });

        if (!deleted) throw new Error("Equipo no encontrado");

        return true;
    }
}

export default new EquipoService();
