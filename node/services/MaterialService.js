import MaterialModel from "../models/MaterialModel.js";
import fs from 'fs';
import path from 'path';

class MaterialService {
    async getAll(){
        return await MaterialModel.findAll()
    }
    async getById(id) {

        const Material = await MaterialModel.findByPk(id)
        if (!Material) throw new Error ("Material no encontrada")
        return Material
    }
    async create(data) {
        return await MaterialModel.create(data)
    }
    async update(id, data) {
        const result = await MaterialModel.update(data, {where: { Id_Material: id}})
        const updated = result[0]

        if (updated === 0) throw new Error("Material no encontrada o sin cambios")

            return true
    }
    async delete(id) {
        const deleted = await MaterialModel.destroy({where: { Id_Material: id }})

        if (!deleted) throw new Error ("Material no encontrada")
            return true
    }

    async removeImage(id, filename) {
        const material = await this.getById(id);

        let imagenes = [];
        try {
            imagenes = JSON.parse(material.img_material || '[]');
        } catch {
            if (material.img_material) {
                imagenes = [material.img_material];
            }
        }

        const nuevasImagenes = imagenes.filter(img => img !== filename);

        await MaterialModel.update(
            { img_material: nuevasImagenes.length > 0 ? JSON.stringify(nuevasImagenes) : null },
            { where: { Id_Material: id } }
        );

        const filePath = path.join('public', 'uploads', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return true;
    }
}

export default new MaterialService()