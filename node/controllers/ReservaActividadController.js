import ReservaActividadService from "../services/ReservaActividadService.js";

// obtener todos los ReservaActividad
export const getAllReservaActividad = async (req, res) => {
    try {
        const ReservaActividad = await ReservaActividadService.getAll()
        res.status(200).json(ReservaActividad)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ReservaActividad por id
export const getReservaActividad = async (req, res) => {

    console.log(req.params.id);
    try {
       const ReservaActividad = await ReservaActividadService.getById(req.params.id)
       res.status(200).json(ReservaActividad)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ReservaActividad
export const createReservaActividad = async (req, res) => {
    try {
        const ReservaActividad = await ReservaActividadService.create(req.body)
        res.status(201).json({ message:"ReservaActividad creado",ReservaActividad})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ReservaActividad
export const updateReservaActividad = async (req, res) => {
    try {
        await ReservaActividadService.update(req.params.id, req.body)
        res.status(200).json({ message: "ReservaActividad actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ReservaActividad 
export const deleteReservaActividad = async (req, res) => {
    try {
        await ReservaActividadService.delete(req.params.id)
        res.status(204).send({ message : "ReservaActividad eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}