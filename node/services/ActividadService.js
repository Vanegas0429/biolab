import { Op } from "sequelize";
import ActividadModel from "../models/ActividadModel.js";
import ActividadEquipoModel from "../models/ActividadEquipoModel.js";
import ActividadMaterialModel from "../models/ActividadMaterialModel.js";
import ActividadReactivoModel from "../models/ActividadReactivoModel.js";
import EquipoModel from "../models/EquipoModel.js";
import MaterialModel from "../models/MaterialModel.js";
import ReactivosModel from "../models/ReactivosModel.js";
import EntradaModel from "../models/EntradaModel.js";

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

        // Filter valid IDs that actually exist in DB
        const validIds = actividadesDb.map(a => a.Id_Actividad);

        const equipos = await ActividadEquipoModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: validIds
                }
            }
        });

        const materiales = await ActividadMaterialModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: validIds
                }
            }
        });

        const reactivos = await ActividadReactivoModel.findAll({
            where: {
                Id_Actividad: {
                    [Op.in]: validIds
                }
            }
        });

        const equiposUnicos = [...new Set(equipos.map(item => item.Id_Equipo))];
        const materialesUnicos = [...new Set(materiales.map(item => item.Id_Material))];
        const reactivosUnicos = [...new Set(reactivos.map(item => item.Id_Reactivo))];

        const equiposDetalle = await EquipoModel.findAll({
            where: { id_equipo: { [Op.in]: equiposUnicos }, estado: 'Activo' },
            attributes: ['id_equipo', 'nombre', 'img_equipo', 'ficha_tecnica', 'marca']
        });

        const materialesDetalle = await MaterialModel.findAll({
            where: { Id_Material: { [Op.in]: materialesUnicos }, Estado: 'Activo' },
            attributes: ['Id_Material', 'Nom_Material', 'Can_Material', 'img_material']
        });

        const reactivosDetalle = await ReactivosModel.findAll({
            where: { Id_Reactivo: { [Op.in]: reactivosUnicos }, Estado: 'Activo' },
            attributes: ['Id_Reactivo', 'Nom_reactivo', 'Presentacion', 'Ficha_tecnica']
        });

        // Get stock details from Entrada table for these reagents
        const entradas = await EntradaModel.findAll({
            where: {
                Id_reactivo: { [Op.in]: reactivosUnicos },
                Estado: 'Activo'
            },
            attributes: ['Id_reactivo', 'Can_Existente', 'Uni_Medida']
        });

        const stockMap = {};
        entradas.forEach(ent => {
            const id = ent.Id_reactivo;
            if (!stockMap[id]) {
                stockMap[id] = { stock: 0, uni: ent.Uni_Medida || '' };
            }
            stockMap[id].stock += Number(ent.Can_Existente || 0);
        });

        const reactivosDetalleConStock = reactivosDetalle.map(reac => {
            const stockInfo = stockMap[reac.Id_Reactivo] || { stock: 0, uni: '' };
            return {
                ...reac.get({ plain: true }),
                cantidad_existente: stockInfo.stock,
                Uni_Medida: stockInfo.uni
            };
        });

        // Filter the allowed IDs based on active items
        const equiposActivosUnicos = equiposDetalle.map(e => e.id_equipo);
        const materialesActivosUnicos = materialesDetalle.map(m => m.Id_Material);
        const reactivosActivosUnicos = reactivosDetalle.map(r => r.Id_Reactivo);

        return {
            actividades: actividadesDb,
            actividadEquipos: equipos,
            actividadMateriales: materiales,
            actividadReactivos: reactivos,
            resumen: {
                equipos: equiposActivosUnicos, // IDs (for backwards compatibility if needed)
                materiales: materialesActivosUnicos,
                reactivos: reactivosActivosUnicos,
                equiposDetalle, // Full objects
                materialesDetalle,
                reactivosDetalle: reactivosDetalleConStock
            }
        };
    }
}

export default new ActividadService();