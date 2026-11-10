import EquipoModel from "../models/EquipoModel.js";

class EquipoService {

    sanitizeData(raw) {
        const data = { ...raw };
        delete data.Id_Equipo;
        delete data.createdAt;
        delete data.updatedAt;

        if (data.nombre && typeof data.nombre === 'string') {
            const trimmed = data.nombre.trim();
            if (trimmed) {
                data.nombre = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        if (data.linea && typeof data.linea === 'string') {
            const trimmed = data.linea.trim();
            data.linea = trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase() : "";
        }

        // Sanitizar campos numéricos y de fecha para evitar errores de MySQL cuando vienen vacíos en FormData
        if (data.vida_util === "" || data.vida_util === "null" || data.vida_util === "undefined" || data.vida_util === null || data.vida_util === undefined) {
            data.vida_util = null;
        } else {
            const parsedVida = parseInt(data.vida_util, 10);
            data.vida_util = isNaN(parsedVida) ? null : parsedVida;
        }

        if (data.valor_unitario === "" || data.valor_unitario === "null" || data.valor_unitario === "undefined" || data.valor_unitario === null || data.valor_unitario === undefined) {
            data.valor_unitario = null;
        } else {
            const parsedValor = parseFloat(data.valor_unitario);
            data.valor_unitario = isNaN(parsedValor) ? null : parsedValor;
        }

        if (
            !data.fecha_adquisicion ||
            data.fecha_adquisicion === "" ||
            data.fecha_adquisicion === "null" ||
            data.fecha_adquisicion === "undefined" ||
            data.fecha_adquisicion === "0000-00-00" ||
            data.fecha_adquisicion === "Invalid date"
        ) {
            data.fecha_adquisicion = null;
        }

        if (!data.estado || data.estado === "null" || data.estado === "undefined") {
            data.estado = "Activo";
        }

        return data;
    }

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

    async create(rawData) {
        const data = this.sanitizeData(rawData);
        return await EquipoModel.create(data);
    }

    async update(Id_Equipo, rawData) {
        const equipo = await EquipoModel.findOne({
            where: { Id_Equipo: Id_Equipo }
        });

        if (!equipo) {
            throw new Error("Equipo no encontrado");
        }

        const data = this.sanitizeData(rawData);

        await EquipoModel.update(
            data,
            { where: { Id_Equipo: Id_Equipo } }
        );

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
