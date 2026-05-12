import MaterialService from "../services/MaterialService.js";

//Obtener todos las Material
export const getAllMaterial = async (req, res) => {
    try{
        const Material = await MaterialService.getAll()
        res.status(200).json(Material) //Ok
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export const getMaterial = async (req, res) => {
    try{
        const Material = await MaterialService.getById(req.params.id)
        res.status(200).json(Material)   
    }catch(error){
        res.status(404).json({message: error.message})
    }
}
export const createMaterial = async (req, res) => {
    try {
        let imagenes = [];
        if (req.files && req.files['img_material']) {
            imagenes = req.files['img_material'].map(f => f.filename);
        }

        const data = {
            ...req.body,
            img_material: imagenes.length > 0 ? JSON.stringify(imagenes) : null
        };

        const Material = await MaterialService.create(data);
        res.status(201).json({ message: "Material creada", Material });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateMaterial = async (req, res) => {
    try {
        const materialExistente = await MaterialService.getById(req.params.id);
        let imagenesExistentes = [];
        try {
            imagenesExistentes = JSON.parse(materialExistente.img_material || '[]');
        } catch {
            if (materialExistente.img_material) {
                imagenesExistentes = [materialExistente.img_material];
            }
        }

        if (req.files && req.files['img_material']) {
            const nuevasImagenes = req.files['img_material'].map(f => f.filename);
            imagenesExistentes = [...imagenesExistentes, ...nuevasImagenes];
        }

        const data = {
            ...req.body,
            img_material: imagenesExistentes.length > 0 ? JSON.stringify(imagenesExistentes) : materialExistente.img_material
        };

        await MaterialService.update(req.params.id, data);
        res.status(200).json({ message: "Material actualizada con éxito" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteMaterialImage = async (req, res) => {
    try {
        await MaterialService.removeImage(req.params.id, req.params.filename);
        res.status(200).json({ message: "Imagen eliminada correctamente" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const deleteMaterial = async(req, res) =>{
    try{
        await MaterialService.delete(req.params.id)
        res.status(204).send()
    }catch(error){
        res.status(400).json({message:error.message})
    }
}