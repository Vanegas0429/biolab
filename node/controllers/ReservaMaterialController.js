import ReservaMaterialService from "../services/ReservaMaterialService.js";

// obtener todos los ReservaMaterial
export const getAllReservaMaterial = async (req, res) => {
    try {
        const ReservaMaterial = await ReservaMaterialService.getAll()
        res.status(200).json(ReservaMaterial)

    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// obtener un ReservaMaterial por id
export const getReservaMaterial = async (req, res) => {

    console.log(req.params.id);
    try {
       const ReservaMaterial = await ReservaMaterialService.getById(req.params.id)
       res.status(200).json(ReservaMaterial)
    }catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// crear un nuevo ReservaMaterial
export const createReservaMaterial = async (req, res) => {
    try {
        const ReservaMaterial = await ReservaMaterialService.create(req.body)
        res.status(201).json({ message:"ReservaMaterial creado",ReservaMaterial})
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//actualizar un ReservaMaterial
export const updateReservaMaterial = async (req, res) => {
    try {
        await ReservaMaterialService.update(req.params.id, req.body)
        res.status(200).json({ message: "ReservaMaterial actualizada correctamente" })
    }catch(error) {
        res.status(400).json({ message: error.message })
    }
}
// eliminar una ReservaMaterial 
export const deleteReservaMaterial = async (req, res) => {
    try {
        await ReservaMaterialService.delete(req.params.id)
        res.status(204).send({ message : "ReservaMaterial eliminado correctamente"})//204 No content (borrado exitoso sin cuerpo))
    }catch (error) {
        res.status(400).json({ message: error.message })
    }
}