import ReservaReactivoService from "../services/ReservaReactivoService.js";

// obtener todos los ReservaReactivo
export const getAllReservaReactivo = async (req, res) => {
    try {
        const ReservaReactivo = await ReservaReactivoService.getAll()
        res.status(200).json(ReservaReactivo)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ReservaReactivo por id
export const getReservaReactivo = async (req, res) => {

    console.log(req.params.id);
    try {
       const ReservaReactivo = await ReservaReactivoService.getById(req.params.id)
       res.status(200).json(ReservaReactivo)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ReservaReactivo
export const createReservaReactivo = async (req, res) => {
    try {
        const ReservaReactivo = await ReservaReactivoService.create(req.body)
        res.status(201).json({ message:"ReservaReactivo creado",ReservaReactivo})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ReservaReactivo
export const updateReservaReactivo = async (req, res) => {
    try {
        await ReservaReactivoService.update(req.params.id, req.body)
        res.status(200).json({ message: "ReservaReactivo actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ReservaReactivo 
export const deleteReservaReactivo = async (req, res) => {
    try {
        await ReservaReactivoService.delete(req.params.id)
        res.status(204).send({ message : "ReservaReactivo eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}