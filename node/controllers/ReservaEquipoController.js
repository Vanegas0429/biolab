import ReservaEquipoService from "../services/ReservaEquipoService.js";

// obtener todos los ReservaEquipo
export const getAllReservaEquipo = async (req, res) => {
    try {
        const ReservaEquipo = await ReservaEquipoService.getAll()
        res.status(200).json(ReservaEquipo)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ReservaEquipo por id
export const getReservaEquipo = async (req, res) => {

    console.log(req.params.id);
    try {
       const ReservaEquipo = await ReservaEquipoService.getById(req.params.id)
       res.status(200).json(ReservaEquipo)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ReservaEquipo
export const createReservaEquipo = async (req, res) => {
    try {
        const ReservaEquipo = await ReservaEquipoService.create(req.body)
        res.status(201).json({ message:"ReservaEquipo creado",ReservaEquipo})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ReservaEquipo
export const updateReservaEquipo = async (req, res) => {
    try {
        await ReservaEquipoService.update(req.params.id, req.body)
        res.status(200).json({ message: "ReservaEquipo actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ReservaEquipo 
export const deleteReservaEquipo = async (req, res) => {
    try {
        await ReservaEquipoService.delete(req.params.id)
        res.status(204).send({ message : "ReservaEquipo eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}