import ReservaEstadoService from "../services/ReservaEstadoService.js";

// obtener todos los ReservaEstado
export const getAllReservaEstado = async (req, res) => {
    try {
        const ReservaEstado = await ReservaEstadoService.getAll()
        res.status(200).json(ReservaEstado)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ReservaEstado por id
export const getReservaEstado = async (req, res) => {

    console.log(req.params.id);
    try {
       const ReservaEstado = await ReservaEstadoService.getById(req.params.id)
       res.status(200).json(ReservaEstado)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ReservaEstado
export const createReservaEstado = async (req, res) => {
    try {
        const ReservaEstado = await ReservaEstadoService.create(req.body)
        res.status(201).json({ message:"ReservaEstado creado",ReservaEstado})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ReservaEstado
export const updateReservaEstado = async (req, res) => {
    try {
        await ReservaEstadoService.update(req.params.id, req.body)
        res.status(200).json({ message: "ReservaEstado actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ReservaEstado 
export const deleteReservaEstado = async (req, res) => {
    try {
        await ReservaEstadoService.delete(req.params.id)
        res.status(204).send({ message : "ReservaEstado eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}