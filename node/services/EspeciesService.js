import EspecieModel from "../models/EspeciesModel.js";
import fs from 'fs';
import path from 'path';

class EspecieService {
    async getAll(){
        return await EspecieModel.findAll()
    }
    async getById(id) {

        const Especie = await EspecieModel.findByPk(id)
        if (!Especie) throw new Error ("Especie no encontrada")
        return Especie
    }
    async create(data) {
        return await EspecieModel.create(data)
    }
    async update(id, data) {
        const result = await EspecieModel.update(data, {where: { Id_especie: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Especie no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await EspecieModel.destroy({where: { Id_especie: id }})

        if (!deleted) throw new Error ("Especie no encontrada")
            return true
    }

    async removeImage(id, filename) {
        const especie = await this.getById(id);

        let imagenes = [];
        try {
            imagenes = JSON.parse(especie.img_especie || '[]');
        } catch {
            if (especie.img_especie) {
                imagenes = [especie.img_especie];
            }
        }

        const nuevasImagenes = imagenes.filter(img => img !== filename);

        await EspecieModel.update(
            { img_especie: nuevasImagenes.length > 0 ? JSON.stringify(nuevasImagenes) : null },
            { where: { Id_especie: id } }
        );

        const filePath = path.join('public', 'uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return true;
    }
}

export default new EspecieService()