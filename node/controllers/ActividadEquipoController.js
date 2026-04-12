import ActividadEquipoService from "../services/ActividadEquipoService.js";

// obtener todos los ActividadEquipo
export const getAllActividadEquipo = async (req, res) => {
    try {
        const ActividadEquipo = await ActividadEquipoService.getAll()
        res.status(200).json(ActividadEquipo)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ActividadEquipo por id
export const getActividadEquipo = async (req, res) => {

    console.log(req.params.id);
    try {
       const ActividadEquipo = await ActividadEquipoService.getById(req.params.id)
       res.status(200).json(ActividadEquipo)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ActividadEquipo
export const createActividadEquipo = async (req, res) => {
    try {
        const ActividadEquipo = await ActividadEquipoService.create(req.body)
        res.status(201).json({ message:"ActividadEquipo creado",ActividadEquipo})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ActividadEquipo
export const updateActividadEquipo = async (req, res) => {
    try {
        await ActividadEquipoService.update(req.params.id, req.body)
        res.status(200).json({ message: "ActividadEquipo actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ActividadEquipo 
export const deleteActividadEquipo = async (req, res) => {
    try {
        await ActividadEquipoService.delete(req.params.id)
        res.status(204).send({ message : "ActividadEquipo eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}