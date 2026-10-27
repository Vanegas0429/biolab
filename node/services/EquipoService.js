import EquipoModel from "../models/EquipoModel.js";
import fs from 'fs';
import path from 'path';
import { Op } from "sequelize";

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

        // Validar que la placa no esté repetida si se envía una placa real
        if (data.placa !== undefined && data.placa !== null) {
            const placaTrimmed = String(data.placa).trim();
            // Si está vacío o es indicativo de sin placa (ej: N/A), se guarda como null y no se valida unicidad
            if (placaTrimmed === "" || placaTrimmed.toUpperCase() === "N/A" || placaTrimmed.toUpperCase() === "SIN PLACA") {
                data.placa = null;
            } else {
                data.placa = placaTrimmed;
                const existePlaca = await EquipoModel.findOne({
                    where: { placa: placaTrimmed }
                });
                if (existePlaca) {
                    throw new Error(`Ya existe un equipo registrado con la placa "${placaTrimmed}". La placa debe ser única.`);
                }
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

        // Validar que la placa no pertenezca a otro equipo
        if (data.placa !== undefined && data.placa !== null) {
            const placaTrimmed = String(data.placa).trim();
            if (placaTrimmed === "" || placaTrimmed.toUpperCase() === "N/A" || placaTrimmed.toUpperCase() === "SIN PLACA") {
                data.placa = null;
            } else {
                data.placa = placaTrimmed;
                const existePlaca = await EquipoModel.findOne({
                    where: {
                        placa: placaTrimmed,
                        Id_Equipo: { [Op.ne]: Id_Equipo }
                    }
                });
                if (existePlaca) {
                    throw new Error(`Ya existe otro equipo registrado con la placa "${placaTrimmed}". La placa debe ser única.`);
                }
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

    // Eliminar una imagen específica del array de imágenes de un equipo
    async removeImage(Id_Equipo, filename) {
        const equipo = await this.getById(Id_Equipo);

        let imagenes = [];
        try {
            imagenes = JSON.parse(equipo.img_equipo || '[]');
        } catch {
            if (equipo.img_equipo) {
                imagenes = [equipo.img_equipo];
            }
        }

        // Filtrar la imagen a eliminar
        const nuevasImagenes = imagenes.filter(img => img !== filename);

        // Actualizar en BD
        await EquipoModel.update(
            { img_equipo: nuevasImagenes.length > 0 ? JSON.stringify(nuevasImagenes) : null },
            { where: { Id_Equipo: Id_Equipo } }
        );

        // Eliminar archivo físico
        const filePath = path.join('public', 'uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return true;
    }
}

export default new EquipoService();