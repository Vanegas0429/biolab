import ActividadMaterialService from "../services/ActividadMaterialService.js";

// obtener todos los ActividadMaterial
export const getAllActividadMaterial = async (req, res) => {
    try {
        const ActividadMaterial = await ActividadMaterialService.getAll()
        res.status(200).json(ActividadMaterial)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ActividadMaterial por id
export const getActividadMaterial = async (req, res) => {

    console.log(req.params.id);
    try {
       const ActividadMaterial = await ActividadMaterialService.getById(req.params.id)
       res.status(200).json(ActividadMaterial)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ActividadMaterial
export const createActividadMaterial = async (req, res) => {
    try {
        const ActividadMaterial = await ActividadMaterialService.create(req.body)
        res.status(201).json({ message:"ActividadMaterial creado",ActividadMaterial})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ActividadMaterial
export const updateActividadMaterial = async (req, res) => {
    try {
        await ActividadMaterialService.update(req.params.id, req.body)
        res.status(200).json({ message: "ActividadMaterial actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ActividadMaterial 
export const deleteActividadMaterial = async (req, res) => {
    try {
        await ActividadMaterialService.delete(req.params.id)
        res.status(204).send({ message : "ActividadMaterial eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}