import EquipoModel from "../models/EquipoModel.js";
import fs from 'fs';
import path from 'path';

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

    // Eliminar una imagen específica del array de imágenes de un equipo
    async removeImage(id_equipo, filename) {
        const equipo = await this.getById(id_equipo);

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
            { where: { id_equipo: id_equipo } }
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