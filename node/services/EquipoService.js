import EquipoModel from "../models/EquipoModel.js";
import fs from 'fs';
import path from 'path';

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
        return await EquipoModel.create(data);
    }

    async update(Id_Equipo, data) {

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