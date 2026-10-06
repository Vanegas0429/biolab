import ReactivosModel from "../models/ReactivosModel.js";

class ReactivosService {
    async getAll(){
        return await ReactivosModel.findAll()
    }
    async getById(id) {

        const Reactivo = await ReactivosModel.findByPk(id)
        if (!Reactivo) throw new Error ("Reactivo no encontrado")
        return Reactivo
    }
    async create(data) {
        if (data.Nom_reactivo && typeof data.Nom_reactivo === 'string') {
            const trimmed = data.Nom_reactivo.trim();
            if (trimmed) {
                data.Nom_reactivo = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        if (data.Nom_reactivo) {
            const normalizedNewName = data.Nom_reactivo.trim().toLowerCase().replace(/\s+/g, ' ');
            const allReactivos = await ReactivosModel.findAll();
            const exists = allReactivos.some(r => r.Nom_reactivo && r.Nom_reactivo.trim().toLowerCase().replace(/\s+/g, ' ') === normalizedNewName);
            if (exists) {
                throw new Error(`Ya existe un reactivo registrado con el nombre "${data.Nom_reactivo.trim()}"`);
            }
        }
        return await ReactivosModel.create(data);
    }
    async update(id, data) {
        if (data.Nom_reactivo && typeof data.Nom_reactivo === 'string') {
            const trimmed = data.Nom_reactivo.trim();
            if (trimmed) {
                data.Nom_reactivo = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            }
        }
        if (data.Nom_reactivo) {
            const normalizedNewName = data.Nom_reactivo.trim().toLowerCase().replace(/\s+/g, ' ');
            const allReactivos = await ReactivosModel.findAll();
            const exists = allReactivos.some(r => String(r.Id_Reactivo) !== String(id) && r.Nom_reactivo && r.Nom_reactivo.trim().toLowerCase().replace(/\s+/g, ' ') === normalizedNewName);
            if (exists) {
                throw new Error(`Ya existe otro reactivo registrado con el nombre "${data.Nom_reactivo.trim()}"`);
            }
        }
        const result = await ReactivosModel.update(data, {where: { Id_Reactivo: id}});
        const updated = result[0];

        if (updated === 0) throw new Error("Reactivo no encontrado o sin cambios");

        return true;
    }
    async delete(id) {
        const deleted = await ReactivosModel.destroy({where: { Id_Reactivo: id }})

        if (!deleted) throw new Error ("Reactivo no encontrado")
            return true
    }
}

export default new ReactivosService()