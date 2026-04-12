import ActividadReactivoService from "../services/ActividadReactivoService.js";

// obtener todos los ActividadReactivo
export const getAllActividadReactivo = async (req, res) => {
    try {
        const ActividadReactivo = await ActividadReactivoService.getAll()
        res.status(200).json(ActividadReactivo)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ActividadReactivo por id
export const getActividadReactivo = async (req, res) => {

    console.log(req.params.id);
    try {
       const ActividadReactivo = await ActividadReactivoService.getById(req.params.id)
       res.status(200).json(ActividadReactivo)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ActividadReactivo
export const createActividadReactivo = async (req, res) => {
    try {
        const ActividadReactivo = await ActividadReactivoService.create(req.body)
        res.status(201).json({ message:"ActividadReactivo creado",ActividadReactivo})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ActividadReactivo
export const updateActividadReactivo = async (req, res) => {
    try {
        await ActividadReactivoService.update(req.params.id, req.body)
        res.status(200).json({ message: "ActividadReactivo actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ActividadReactivo 
export const deleteActividadReactivo = async (req, res) => {
    try {
        await ActividadReactivoService.delete(req.params.id)
        res.status(204).send({ message : "ActividadReactivo eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}