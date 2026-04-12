import { Op } from "sequelize";
import ActividadModel from "../models/ActividadModel.js";
import ActividadEquipoModel from "../models/ActividadEquipoModel.js";
import ActividadMaterialModel from "../models/ActividadMaterialModel.js";
import ActividadReactivoModel from "../models/ActividadReactivoModel.js";

class ActividadService {

    async getAll() {
        return await ActividadModel.findAll();
    }

    async getById(id) {
        const Actividad = await ActividadModel.findByPk(id);
        if (!Actividad) throw new Error('Actividad no encontrada');
        return Actividad;
    }

    async create(data) {
        return await ActividadModel.create(data);
    }

    async update(id, data) {
        const result = await ActividadModel.update(data, { where: { Id_Actividad: id } });
        const updated = result[0];

        if (updated === 0) throw new Error('Actividad no encontrada o sin cambios');

        return true;
    }

    async delete(id) {
        const deleted = await ActividadModel.destroy({ where: { Id_Actividad: id } });
        if (deleted === 0) throw new Error('Actividad no encontrada');
        return true;
    }

    async getRecursosByActividades(actividades) {
        if (!Array.isArray(actividades) || actividades.length === 0) {
            throw new Error("Debe enviar al menos una actividad");
        }

        const actividadesIds = [...new Set(actividades.map(id => Number(id)).filter(Boolean))];

        const actividadesDb = await ActividadModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: actividadesIds
                }
            }
        });

        if (actividadesDb.length !== actividadesIds.length) {
            throw new Error("Una o más actividades no existen");
        }

        const equipos = await ActividadEquipoModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: actividadesIds
                }
            }
        });

        const materiales = await ActividadMaterialModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: actividadesIds
                }
            }
        });

        const reactivos = await ActividadReactivoModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: actividadesIds
                }
            }
        });

        const equiposUnicos = [...new Set(equipos.map(item => item.Id_Equipo))];
        const materialesUnicos = [...new Set(materiales.map(item => item.Id_Material))];
        const reactivosUnicos = [...new Set(reactivos.map(item => item.Id_Reactivo))];

        return {
            actividades: actividadesDb,
            actividadEquipos: equipos,
            actividadMateriales: materiales,
            actividadReactivos: reactivos,
            resumen: {
                equipos: equiposUnicos,
                materiales: materialesUnicos,
                reactivos: reactivosUnicos
            }
        };
    }
}

export default new ActividadService();